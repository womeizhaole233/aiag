#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import os, json, re

app = Flask(__name__)
app.secret_key = 'baisha-chenyan-archaeology-2024'

# ==================== 内容覆盖配置 ====================
OVERRIDES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content_overrides.json')
LEGACY_BG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bg_overrides.json')
# 锁定节点：含交互式谜题，背景不允许修改（文本/speaker 仍可改）
BG_LOCKED_NODES = {'tomb_gate_puzzle', 'door_examined'}
# overrides 保留键
CUSTOM_NODES_KEY = '__custom_nodes__'
# 终止节点的 next 值
TERMINAL_NEXTS = {'game_end', 'game_over'}

def load_overrides():
    """返回 {node_id: {bg?, speaker?, text?}}。兼容老版 bg_overrides.json。"""
    data = {}
    if os.path.exists(OVERRIDES_FILE):
        try:
            with open(OVERRIDES_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f) or {}
        except Exception:
            data = {}
    # 迁移老文件（仅存 bg 字符串）
    if not data and os.path.exists(LEGACY_BG_FILE):
        try:
            with open(LEGACY_BG_FILE, 'r', encoding='utf-8') as f:
                legacy = json.load(f) or {}
            for k, v in legacy.items():
                if isinstance(v, str) and v:
                    data[k] = {'bg': v}
            save_overrides(data)
        except Exception:
            pass
    # 容错：如果是字符串（老格式）转成 dict。保留键原样保留。
    cleaned = {}
    for k, v in data.items():
        if k == CUSTOM_NODES_KEY:
            cleaned[k] = v if isinstance(v, dict) else {}
        elif isinstance(v, str):
            cleaned[k] = {'bg': v}
        elif isinstance(v, dict):
            cleaned[k] = v
    return cleaned

def save_overrides(data):
    with open(OVERRIDES_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def apply_overrides(node_id, dialogue):
    """返回叠加覆盖后的 (speaker, text, bg, portrait, next_id)。portrait 可为 None。"""
    overrides = load_overrides().get(node_id, {})
    speaker = overrides.get('speaker') or dialogue.get('speaker', '')
    text = overrides.get('text') if overrides.get('text') is not None else dialogue.get('text', '')
    bg = overrides.get('bg') or dialogue.get('background_image')
    portrait = overrides.get('portrait') or dialogue.get('portrait')
    next_id = overrides.get('next') if overrides.get('next') is not None else dialogue.get('next')
    return speaker, text, bg, portrait, next_id

def get_custom_nodes():
    """返回自定义节点字典 {id: {speaker, text, next, bg?, portrait?}}。"""
    return load_overrides().get(CUSTOM_NODES_KEY, {}) or {}

def get_dialogue(node_id):
    """统一查询：先查原生 DIALOGUES，再查自定义节点。返回 None 代表不存在。"""
    if node_id in DIALOGUES:
        return DIALOGUES[node_id]
    custom = get_custom_nodes()
    return custom.get(node_id)

def all_node_ids():
    """返回原生 + 自定义节点的所有 id。"""
    return list(DIALOGUES.keys()) + list(get_custom_nodes().keys())

def list_image_assets():
    """扫描 static/images 下的所有图片，按目录分组返回"""
    base = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'images')
    groups = {}
    exts = {'.png', '.jpg', '.jpeg', '.webp'}
    for root, _, files in os.walk(base):
        for fn in files:
            if os.path.splitext(fn)[1].lower() not in exts:
                continue
            full = os.path.join(root, fn)
            rel = os.path.relpath(full, os.path.dirname(os.path.abspath(__file__))).replace(os.sep, '/')
            group = os.path.relpath(root, base).replace(os.sep, '/') or '(root)'
            groups.setdefault(group, []).append(rel)
    for g in groups:
        groups[g].sort()
    # portraits/ 子目录置顶
    def _sort_key(item):
        g = item[0]
        return (0 if g.startswith('portraits') else 1, g)
    return dict(sorted(groups.items(), key=_sort_key))

# ==================== 墓门解密：热区数据（来自 aiag M1） ====================
TOMB_GATE_HOTSPOTS = [
    {
        "id": "lintel", "title": "墓门门额",
        "rect": [0.37, 0.14, 0.63, 0.31],
        "body": "墓门门额正面题有墓主信息。\n门额背面可见一幅完整的卷草纹彩画。\n正面为题字，背面为彩画，质地与图像均不相同。",
        "record": "墓门门额正面题有墓主信息，背面可见完整卷草纹彩画。"
    },
    {
        "id": "lintel_back", "title": "门额背面彩画",
        "rect": [0.39, 0.07, 0.61, 0.17],
        "body": "墓门门额背面可见完整卷草纹彩画。\n卷草以墨线勾勒，青绿填色，纹样从中心向两侧延伸，总长约一尺八寸。\n背面朱红底色与正面白灰层质地不同，卷草纹下边缘有一道水平裁切线。",
        "record": "门额背面有完整卷草纹彩画，总长约一尺八寸；背面朱红底色与正面白灰层质地不同，下缘见水平裁切线。",
        "required": True
    },
    {
        "id": "brick_seam", "title": "封门砖缝",
        "rect": [0.28, 0.39, 0.43, 0.76],
        "body": "墓门外层封门砖的灰缝中嵌着几粒石英砂，在手电下闪着细小的光点。\n石英砂粒径约半分，与本地夯土中常见的石英砂一致。\n石英砂与石灰浆的胶结状态与周围灰缝一致。",
        "record": "封门砖灰缝中可见石英砂光点，粒径约半分；其与石灰浆胶结状态和周围灰缝一致。"
    },
    {
        "id": "left_wall", "title": "墓道墙面",
        "rect": [0.05, 0.28, 0.25, 0.72],
        "body": "手电光扫过墓道壁面时，某些砖缝渗出的水珠在手电玻璃罩上凝成一层细雾。\n越靠近墓门，雾越浓。\n水汽无固定来源，不同砖缝渗出量不一致。",
        "record": "墓道砖缝渗出的水珠可在手电玻璃罩上凝成细雾；越靠近墓门，雾越浓。"
    },
    {
        "id": "threshold", "title": "门前地面",
        "rect": [0.32, 0.79, 0.68, 0.96],
        "body": "门前地面位于墓道与墓门之间。\n地面色泽较暗，尘土沿门洞前缘沉积。\n封门砖下缘与地面交界处仍可辨认。",
        "record": "门前地面位于墓道与墓门之间，封门砖下缘与地面交界处可辨认。"
    },
    {
        "id": "door_opening", "title": "门洞深处",
        "rect": [0.44, 0.36, 0.56, 0.80],
        "body": "墓门后部与甬道东壁相接。\n门洞内侧光线较暗，通道向墓室深处收窄。\n门额、门框与甬道侧壁在此处衔接。",
        "record": "墓门后部与甬道相接，门额、门框与甬道侧壁在此处衔接。",
        "is_exit": True,
        "exit_title": "进入甬道",
        "exit_body": "墓门的几处信息已经记录。\n门洞之后，甬道顶部压低。\n光线沿砖缝向内收窄，前方可以继续观察。",
        "locked_body": "门洞深处光线较暗。\n入口信息尚未整理完整。\n（还需：门额背面彩画 / 至少 3 条记录）"
    },
]

# ==================== 对话数据 ====================
DIALOGUES = {
    "start": {
        "speaker": "系统",
        "text": "你坐了六个小时的卡车，又在驴车上颠了两个钟头，才在一片铅灰色的冬日天空下，望见了几棵老槐树掩映的土房。\n\n河南，禹县，白沙镇。\n\n一个在地图上几乎找不到名字的地方，可你的外祖父来过。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "arrive"
    },
    "arrive": {
        "speaker": "系统",
        "text": "十二月的华北平原，风裹着干燥的尘土扑面而来。你下意识地紧了紧灰蓝列宁装的领口，手指碰到了一根细细的皮绳。\n\n皮绳上系着一枚银怀表链扣。圆形，比铜钱略大，银质表面布满了细密的裂纹。那是外祖父的遗物。",
        "background_image": "static/images/entrance.png",
        "choices": [], "next": "meet_su"
    },
    "meet_su": {
        "speaker": "???",
        "text": "“林同志？”",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "转过身", "next": "su_intro"}], "next": None
    },
    "su_intro": {
        "speaker": "苏池",
        "text": "“我是苏池。粟老师说你今天到，让我来接一下。”\n\n他身后跟着一个拎画板的姑娘。\n\n“这位是周淼，测绘的。”",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "“你好，辛苦了”", "next": "zhou_hello"}], "next": None
    },
    "zhou_hello": {
        "speaker": "周淼",
        "text": "“林师姐！路上辛苦了！”\n\n她笑起来嘴角两个酒窝。",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "“明天什么时候开工？”", "next": "ask_time"}], "next": None
    },
    "ask_time": {
        "speaker": "苏池",
        "text": "“粟老师在镇上供销社给你留了饭，让你今晚好好歇着，明天——”",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "“明天什么时候开工？”", "next": "insist_time"}], "next": None
    },
    "insist_time": {
        "speaker": "苏池",
        "text": "他愣了一下，“五点半。”",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "“那麻烦你带我直接去工地吧。”", "next": "go_to_site"}], "next": None
    },
    "go_to_site": {
        "speaker": "系统",
        "text": "缓坡顶上，你看见了那片隆起的高地。",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "meet_su_teacher"
    },
    "meet_su_teacher": {
        "speaker": "系统",
        "text": "一个瘦高的身影正蹲在土台边上，手电光在暮色里晃。他穿了一身洗得发白的蓝布中山装，背对着你，正用放大镜一寸一寸地看着什么。",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "question_1"
    },
    "question_1": {
        "speaker": "粟柏年",
        "text": "“路上看见那条干河道了吗？”",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [
            {"text": "东北-西南", "next": "wrong_answer"},
            {"text": "西北-东南", "next": "correct_answer"},
            {"text": "东南-西北", "next": "wrong_answer"}
        ], "next": None
    },
    "wrong_answer": {
        "speaker": "粟柏年",
        "text": "他微不可见地皱了下眉头，摇摇头说：“地形勘测在考古过程中也是很重要的一步。那条干河道是西北到东南走向。”",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "correct_answer_force"
    },
    "correct_answer": {
        "speaker": "粟柏年",
        "text": "“嗯。”他终于站起来，转过身，“观察得很仔细。明天早上五点半，在这个位置，先看墓道。”",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "teacher_intro"
    },
    "correct_answer_force": {
        "speaker": "粟柏年",
        "text": "“观察得很仔细。明天早上五点半，在这个位置，先看墓道。”",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "teacher_intro"
    },
    "teacher_intro": {
        "speaker": "系统",
        "text": "你与他打了个照面。\n\n瘦而高，眼镜腿断过一次，用白胶布缠着。\n\n粟柏年，29岁，北大考古专业青年教师，也是你接下来的领队老师。",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "teacher_say"
    },
    "teacher_say": {
        "speaker": "粟柏年",
        "text": "“休息吧，”他温和道，“明天会很累。”",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [{"text": "第一章：墓门清理", "next": "chapter1"}], "next": None
    },
    "chapter1": {
        "speaker": "系统",
        "text": "【第一章·封门砖】\n\n天蒙蒙亮。\n\n粟柏年已经蹲在墓道口了。墓道北偏东，长五米余，入口处的填土已经被清理干净，露出了一道青灰色的封门砖墙。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "brick_wall"
    },
    "brick_wall": {
        "speaker": "粟柏年",
        "text": "“你看封门砖的砌法。”他用手铲轻轻叩了叩砖面，“一顺一丁，砌三层。这是北宋中晚期的标准砌法。”",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "find_crack"
    },
    "find_crack": {
        "speaker": "系统",
        "text": "外层拆到第七块的时候，你停了下来。\n\n手电光穿过横砖之间的灰缝，打在最里层卧丁砖的砖面上——一道细细的阴影斜在砖面上。\n\n不是灰缝。灰缝是直的。这道阴影是斜的，从砖的右上角延伸到左下角，是一道裂缝。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "crack_decision"
    },
    "crack_decision": {
        "speaker": "粟柏年",
        "text": "“继续拆，还是暂停？”他问你。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [
            {"text": "❌ 继续拆，裂缝不大", "next": "wrong_decision"},
            {"text": "✅ 暂停，先架支撑", "next": "correct_decision"}
        ], "next": None
    },
    "wrong_decision": {
        "speaker": "系统",
        "text": "你犹豫了一下，说出自己的判断：“继续拆。”\n\n常福来继续撬下一块菱角牙子。铁钎插进砖缝，用力一扳，砖孔后面的裂缝忽然变宽了……\n\n你清清楚楚地看见那道裂缝从一毫米变成了将近三毫米，中间一小片砖屑掉下来。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "wrong_decision_end"
    },
    "wrong_decision_end": {
        "speaker": "粟柏年",
        "text": "他并没有责怪你，只是在那天的发掘记录末尾写了一行：\n\n“拆至外层第七砖，内层卧丁砖原裂缝扩展，疑因外层支撑减弱所致。后续已加撑。”\n\n你站在旁边，看见他写这行字的时候，笔尖按得比平时重。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "door_reveal"
    },
    "correct_decision": {
        "speaker": "系统",
        "text": "你把判断告诉了粟柏年。他点了点头，转身朝外面喊：“常师傅，备两根立柱和一根过梁。架在过道北壁下面。”\n\n立柱架起来的时候，粟柏年又看了一眼那道裂缝，他什么都没说，但你听到他轻轻呼了一口气。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "after_correct"
    },
    "after_correct": {
        "speaker": "系统",
        "text": "之后继续拆外层砖，裂缝没有扩大。内层那块卧丁砖被取下以后，你翻过来看，发现裂缝已经深入到砖厚的一半。\n\n它不是今天才裂的，它被外层和中层死死压住，压了九百年。",
        "background_image": "static/images/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "door_reveal"
    },
    # ===== 墓门解密关卡入口（新增） =====
    "door_reveal": {
        "speaker": "系统",
        "text": "封门砖被逐块取下，墓门缓缓显形。\n\n一座千年以前的门楼完好地立在眼前，仿木斗拱层层叠出，每一朵都有金粉勾边的余痕。\n\n粟柏年压低了声音：“别急着进去，先把墓门各处看清楚——门额、砖缝、墓道、门洞，按顺序记下来。”",
        "background_image": "static/images/door.png",
        "choices": [{"text": "举起手电，靠近墓门", "next": "tomb_gate_puzzle"}], "next": None
    },
    "tomb_gate_puzzle": {
        "speaker": "系统",
        "text": "（操作提示：点击墓门上的不同位置进行观察。需记录“门额背面彩画”并累计至少 3 条记录，方可由门洞深处进入甬道。）",
        "background_image": "static/images/door.png",
        "puzzle": "tomb_gate",
        "choices": [], "next": None
    },
    "door_examined": {
        "speaker": "系统",
        "text": "你把刚才的观察一条条记在田野笔记上。\n\n门额背面那幅卷草纹彩画——本不该出现在外人看得见的位置。门额正面题着墓主信息，背面却藏着完整的彩绘，这本身就是一处反常。\n\n粟柏年凑过来看你的笔记，沉默了几秒，只说了一句：“记下来，先不下结论。”",
        "background_image": "static/images/door.png",
        "choices": [], "next": "discover_second_tomb"
    },
    "discover_second_tomb": {
        "speaker": "民工老张",
        "text": "“粟队长！北边又顶出来一个砖顶子！”",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "su_response"
    },
    "su_response": {
        "speaker": "粟柏年",
        "text": "“多远？”\n\n“二十来米，西北。”\n\n他回头看了一眼正在测绘的墓门，“先把顶砖回封，浮土盖回去，做个标记。今天所有人还在一号墓上。另一座要等这边的档期。”",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "tomb_open"
    },
    "tomb_open": {
        "speaker": "系统",
        "text": "墓室终于被打开了。\n\n手电光束扫过穹窿顶上的彩画，然后落在四壁。\n\n所有人都被眼前的景象震撼到。",
        "background_image": "static/images/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "north_wall"
    },
    "north_wall": {
        "speaker": "系统",
        "text": "你举着灯靠近北壁。\n\n夫妇对坐图。男子面容饱满，戴幞头，穿圆领袍。女子梳高髻，着对襟褙子。两人袖手而坐。桌上有酒壶、经瓶、台盏。\n\n身后各有一扇屏风，屏风上绘着山水。\n\n但你的注意力不在人像上。\n\n在屏风。",
        "background_image": "static/images/rear-north.png",
        "choices": [], "next": "hidden_text"
    },
    "hidden_text": {
        "speaker": "系统",
        "text": "你贴近屏风，在侧光下逐段辨读。\n\n裂隙间隐约透出连续的文字，但被千年的颜料覆盖……",
        "background_image": "static/images/rear-north.png",
        "choices": [{"text": "仔细辨认", "next": "decipher_text"}], "next": None
    },
    "decipher_text": {
        "speaker": "你",
        "text": "崇宁四年秋……颖水泛溢……民饥……\n\n三千石以济……不敢使人知……\n\n天可鉴……不可传……\n\n后人知……赵怀诚",
        "background_image": "static/images/rear-north.png",
        "choices": [], "next": "hidden_meaning"
    },
    "hidden_meaning": {
        "speaker": "系统",
        "text": "屏风山水画中隐藏的文字，可辨内容：\n\n“崇宁四年秋，颖水泛溢，民饥……三千石以济……不敢使人知”\n\n赵怀诚——应当就是墓主赵大翁的本名。\n他做了某件事，不敢让人知道。",
        "background_image": "static/images/rear-north.png",
        "choices": [{"text": "继续探索墓室", "next": "find_bronze"}], "next": None
    },
    "find_bronze": {
        "speaker": "系统",
        "text": "墓室西北角的方砖下，有一处空心。\n\n砖被揭开以后，露出一口长方形的小室，一尺见方，三寸深。室内放着一只铜筒，两端密封，蜡封完整。",
        "background_image": "static/images/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
        "choices": [], "next": "open_bronze"
    },
    "open_bronze": {
        "speaker": "粟柏年",
        "text": "“你来释读。”",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [{"text": "小心展开绢帛", "next": "read_silk"}], "next": None
    },
    "read_silk": {
        "speaker": "系统",
        "text": "你接过绢帛。侧光下，墨迹清晰工整。\n\n“怀诚谨记：余十六起家，三十成业……崇宁四年一事，耿耿于怀……”\n\n绢帛下端三处被水渍浸染，残缺难辨。",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [{"text": "补全残缺文字", "next": "complete_text"}], "next": None
    },
    "complete_text": {
        "speaker": "系统",
        "text": "经过反复辨认，你逐步补全了残缺的文字：\n\n“饥民鬻儿卖女”\n“府库之粮，皆在簿册，私动一粒即斩”\n“本官今夜酒醉，不省人事”",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "full_text"
    },
    "full_text": {
        "speaker": "赵怀诚",
        "text": "“余遂以李公手谕，开府库，调三千石粮。又以自家粮米抵还府库。此事惟余与李公二人知情，迄今二十载……\n\n今将此绢藏于暗格，留待后人评说。知我罪我，惟待后人。”\n\n崇宁五年腊月 赵怀诚泣血谨记",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "ending"
    },
    "ending": {
        "speaker": "系统",
        "text": "墓室里安静了很久。\n\n常福来蹲在角落里抽旱烟，吐出一口烟，打破沉默：“这是个好人。”\n\n粟柏年没有接话。你也没有。\n\n不是不想说。是你说不出来。\n\n那个秘密藏在屏风画里，藏在暗格铜筒里，藏了九百多年。\n\n终于被人读到了。",
        "background_image": "static/images/rear-north.png",
        "choices": [], "next": "relocation_clue"
    },

    # ========== 迁葬推理 ==========
    "relocation_clue": {
        "speaker": "常福来",
        "text": "“林同志，你过来看看这骨头。”\n\n后室砖床上有一层朽木的痕迹，勾出了棺材的轮廓。你用皮尺量了铁钉之间的最大范围——长约一米八，宽约七十公分。\n\n这个尺寸，放两具完整的成人遗体太勉强了。",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "relocation_observe"
    },
    "relocation_observe": {
        "speaker": "系统",
        "text": "棺内两具骨架。头骨摆放还算整齐，但身体部分的骨骼混堆在头骨东侧。小骨片散乱重叠，像是被集中堆放进去的。\n\n你用放大镜检查了一块足骨的断面——断口干净，没有火烧痕迹，也没有近期被翻动的新鲜断面。",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "relocation_question"
    },
    "relocation_question": {
        "speaker": "粟柏年",
        "text": "“你怎么看？\n\n骨骼为什么会这样混堆？”",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [
            {"text": "A. 被火烧过，骨殖散乱", "next": "relocation_wrong"},
            {"text": "B. 墓被盗扰，盗墓者翻乱了", "next": "relocation_wrong"},
            {"text": "C. 原葬于别处，后迁葬至此", "next": "relocation_correct"}
        ], "next": None
    },
    "relocation_wrong": {
        "speaker": "粟柏年",
        "text": "他摇了摇头。\n\n“断口没有火烧的炭化层，也没有近期翻动的新鲜茬口。封门砖砌得是死的，盗洞也找不到。\n\n再想想——头骨整齐，身骨混堆。这是被人特意按某种方式放进去的。”",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "relocation_correct"
    },
    "relocation_correct": {
        "speaker": "系统",
        "text": "迁葬。\n\n二次葬。头骨被特意安放，身体骨骼集中堆置。棺材不需要太大——放的只是骨骸，不是遗体。\n\n你忽然想到一个问题。",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "relocation_note"
    },
    "relocation_note": {
        "speaker": "系统",
        "text": "一号墓建于元符二年——1099 年。\n但绢帛的落款是崇宁五年——1106 年。\n\n赵怀诚在 1106 年还活着——他在那一年冬天写下了绢帛。\n\n那 1099 年这个墓里葬的是谁？\n\n你把这个问题写在笔记里，画了一个圈。家谱或可解答——但家谱在哪里？",
        "background_image": "static/images/M1/16_出土器物与人骨/M1出土物分布图.png",
        "choices": [{"text": "合上笔记，去前室复核临摹稿", "next": "travel1_trigger"}], "next": None
    },

    # ========== 第一次穿越 ==========
    "travel1_trigger": {
        "speaker": "系统",
        "text": "一号墓的测绘和清理在 12 月 31 日中午全部完成。下午一部分人去西北面接着挖二号墓。\n\n你的任务是协助周淼复核一号墓壁画临摹稿。前室的临摹稿已经完成大半，你正对照北壁夫妇对坐图检查轮廓——\n\n手指不小心碰到脖子上挂的银怀表链扣。\n\n它忽然变得温热。",
        "background_image": "static/images/rear-north.png",
        "choices": [], "next": "travel1_dorm"
    },
    "travel1_dorm": {
        "speaker": "系统",
        "text": "傍晚。驻地宿舍。\n\n你从行李箱最底层翻出一个蓝布小包，里面是另外两件外祖父的遗物——一枚铜扣，一把铜钥匙。\n\n铜扣的形状和你的银扣几乎一样：圆形，比铜钱略大。表面布满绿锈，裂纹密布。手稿里夹着一张毛边纸——\n\n民国二十六年十月，白沙。\n外祖父林霁春写：“此扣与银扣同出白沙土中，或为一器之分，暂收以待来日。”",
        "background_image": "static/images/entrance.png",
        "choices": [], "next": "travel1_fit"
    },
    "travel1_fit": {
        "speaker": "系统",
        "text": "你试着把两枚扣子放在一起。\n\n严丝合缝——凹凸对应，像锁和钥匙。\n\n铜扣在你手心里忽然烫了一下。指尖碰到的那几道裂纹正在缓慢发光，柔和的，琥珀色的。\n\n窗外那棵老槐树的影子在风里晃了一下。一股焚烧稻草和尘土的气味涌过来——不是从窗外。\n\n树叶忽然不再沙沙响了。周围的声音在消失。你的视野开始变窄。",
        "background_image": "static/images/entrance.png",
        "choices": [], "next": "travel1_handsbody"
    },
    "travel1_handsbody": {
        "speaker": "系统",
        "text": "你低头看自己的手——手指正在变得粗糙，关节粗大，皮肤上爬满褶皱和旧的茧。\n\n这不是你的手。\n\n抬起头，老槐树不见了。取而代之的是一棵更老更粗的槐树。牛车正从外面的土路上碾过去，牛铃叮叮当当。\n\n膝盖撞到了一张账房的老木桌。砚台里还汪着半干的墨。\n\n账本封面写着：“赵氏粮行日用流水，大观二年”。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "travel1_open_warehouse"
    },
    "travel1_open_warehouse": {
        "speaker": "系统",
        "text": "【你不能动。你只是困在这具身体里，透过他的眼睛看。】\n\n崇宁四年的秋天。颖河堤已经在三天前溃了。\n\n你——赵怀诚——站在自家粮铺门口。街面上挤满逃难的人。一个女人蹲在墙角，怀里搂着个婴儿，婴儿哭声已经哑了。\n\n你看见赵怀诚转过身：“开仓。”\n\n赵家粮铺过去五年的存粮，两天就见了底。第三天，算盘珠子在指节下排出一个数字——三千石。\n\n不够。",
        "background_image": "static/images/M1/06_前室_南壁/第一号墓前室南壁壁画.png",
        "choices": [], "next": "travel1_state_office"
    },
    "travel1_state_office": {
        "speaker": "系统",
        "text": "州府衙门侧门的灯笼在夜风里晃。\n\n知州李明辅坐在灯下，面前摊着府库的粮册。赵怀诚在他对面坐下，没有说话。",
        "background_image": "static/images/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
        "choices": [], "next": "travel1_li_dialogue"
    },
    "travel1_li_dialogue": {
        "speaker": "李明辅",
        "text": "“府库里的粮，都在簿册上。\n\n私动一粒，就是死罪。”",
        "background_image": "static/images/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
        "choices": [], "next": "travel1_zhao_reply"
    },
    "travel1_zhao_reply": {
        "speaker": "赵怀诚",
        "text": "“李公若是不知，便是怀诚自己取的。\n\n三千石，都算在怀诚头上。”",
        "background_image": "static/images/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
        "choices": [], "next": "travel1_li_drunk"
    },
    "travel1_li_drunk": {
        "speaker": "李明辅",
        "text": "沉默了很长时间。然后他站起来，走到窗边，把窗户推开一条缝。冷风灌进来，吹得灯焰几乎灭了。\n\n“本官今夜酒醉，不省人事。”",
        "background_image": "static/images/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
        "choices": [], "next": "travel1_oldman"
    },
    "travel1_oldman": {
        "speaker": "系统",
        "text": "门在身后关上的时候，你感觉到赵怀诚在台阶上站了一会儿。\n\n一个守门的老衙役看了他一眼。老衙役什么都没说，只是把侧门的门闩拉开了——那扇门白天从来不开。然后他转过身，面对着墙，假装什么都没有看见。\n\n火把的光晃了一下。赵怀诚朝官仓走去。\n\n你感觉到他眼眶里有什么东西涌上来。不是泪，是某种比泪更烫的东西。",
        "background_image": "static/images/M1/07_前室_北壁/第一号墓前室北壁东部.png",
        "choices": [], "next": "travel1_back"
    },
    "travel1_back": {
        "speaker": "系统",
        "text": "铜扣在你手心里冷却。\n\n窗外的槐树长得很高了，是 1951 年冬夜的秃枝。\n\n你慢慢地吐出一口气。手还在抖。低头看自己的手指——细细的，没有老茧。\n\n刚才不是你在动，是你在看着。\n\n赵怀诚站在州府门口的那个背影，好像还在你眼皮子底下站着。脑子里只有一个念头——这个“赵大翁”，根本不是什么善人。他是一个差点掉了脑袋的罪人。\n\n他自己守着这个秘密，守到死。",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "把铜扣挂在银扣旁边", "next": "travel1_endnote"}], "next": None
    },
    "travel1_endnote": {
        "speaker": "系统",
        "text": "你把铜扣挂在了银扣旁边。两枚扣子挨在一起，碰撞时发出一声极轻的响，像锁簧归位。\n\n明天。\n\n明天要开二号墓。",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "第二章：二号墓", "next": "chapter2"}], "next": None
    },

    # ==================== 第二章：二号墓 ====================
    "chapter2": {
        "speaker": "系统",
        "text": "1952 年 1 月 1 日。新年没有任何仪式，工地照常开工。\n\n二号墓位于一号墓西北约二十米。封门砖比一号墓更整齐，砖缝灌着白灰。粟柏年判断：墓主身份高于一号墓主。\n\n一天后，墓门打开。",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "chapter2_enter"
    },
    "chapter2_enter": {
        "speaker": "系统",
        "text": "二号墓为单室仿木结构砖室墓。墓室呈八角形，斗拱繁复，远胜一号墓。\n\n西南壁——一幅地图。墨线勾出山川，标注六个地名：白沙、汜水、洛阳、太原、忻州、雁门。\n\n一条细朱线，从白沙北上，止于雁门。",
        "background_image": "static/images/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
        "choices": [], "next": "chapter2_ledger"
    },
    "chapter2_ledger": {
        "speaker": "系统",
        "text": "棺床下方暗格里，发现一卷麻纸账本。封面无字。\n\n粟柏年用稀释的明矾水刷过——隐墨显形。\n\n大观元年至三年间的流水：粮、盐、铁、马蹄铁、皮甲衬里。其中四十二条注明“北行”，目的地皆为雁门。",
        "background_image": "static/images/front-west.png",
        "choices": [], "next": "chapter2_puzzle_supply"
    },
    "chapter2_puzzle_supply": {
        "speaker": "粟柏年",
        "text": "“四十二条北行记录，都是马蹄铁、皮甲衬里、咸盐、糙米这类东西。\n\n你说，这些是运给谁的？”",
        "background_image": "static/images/front-west.png",
        "choices": [
            {"text": "A. 北方亲戚的日常贴补", "next": "chapter2_supply_wrong"},
            {"text": "B. 边军军需", "next": "chapter2_supply_correct"},
            {"text": "C. 普通边境互市贸易", "next": "chapter2_supply_wrong"}
        ], "next": None
    },
    "chapter2_supply_wrong": {
        "speaker": "粟柏年",
        "text": "“数额对不上。马蹄铁单条就上千副，皮甲衬里成捆——\n\n这是装备一支军队的量。况且大观年间，朝廷管控边境铁器极严。”",
        "background_image": "static/images/front-west.png",
        "choices": [], "next": "chapter2_supply_correct"
    },
    "chapter2_supply_correct": {
        "speaker": "系统",
        "text": "军需。\n\n账本扉页背面，露出一行更细的字：“枢密院丁字号信牌为凭”。\n\n暗格深处又取出一枚铜质信牌，边缘刻着反切符号。粟柏年熬了一夜，反切对出四个字——\n\n“便宜行事”。",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "chapter2_zhongan"
    },
    "chapter2_zhongan": {
        "speaker": "系统",
        "text": "赵仲安——赵怀诚之子。大观年间领枢密院密令，主持“北行”军需，为雁门防线输送物资。\n\n这不是一个商人的墓。这是一个为帝国边防偷偷输血的人的墓。\n\n夜里，铜扣再度发热。",
        "background_image": "static/images/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁.png",
        "choices": [{"text": "接受第二次穿越", "next": "travel2_open"}], "next": None
    },

    # ========== 第二次穿越 ==========
    "travel2_open": {
        "speaker": "系统",
        "text": "账房。烛火。账本摊开。\n\n你——赵仲安——握着笔，手却在抖。窗外有马蹄声远远过去。\n\n门帘被掀开，进来的是妻子刘氏。她接过笔，蘸墨，落字稳如磐石。\n\n“你写不下去的字，我替你写。”",
        "background_image": "static/images/front-west.png",
        "choices": [], "next": "travel2_liu"
    },
    "travel2_liu": {
        "speaker": "刘氏",
        "text": "“典田的契书我已经画了押。城东三十亩，给王老爹；城南二十亩，给周屠户家。\n\n这个月北边再要一批马蹄铁，缺的钱，从这里出。”",
        "background_image": "static/images/front-west.png",
        "choices": [], "next": "travel2_warn"
    },
    "travel2_warn": {
        "speaker": "赵仲安",
        "text": "“信牌不能留在家里。\n\n把信牌藏到墓里去——壁画后面。等我死了，跟我一起埋了。\n\n这条命，是替朝廷扛着的。命没了，证据也得跟着没。”",
        "background_image": "static/images/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
        "choices": [], "next": "travel2_back"
    },
    "travel2_back": {
        "speaker": "系统",
        "text": "铜扣冷却。\n\n你回到 1952 年 1 月 3 日深夜。手里的铅笔尖断了。\n\n你忽然明白：二号墓壁画后面那个暗格——不是临时起意，是他生前就规划好的。\n\n一个把朝廷的秘密带进坟墓的人。",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "第三章：三号墓", "next": "chapter3"}], "next": None
    },

    # ==================== 第三章：三号墓 ====================
    "chapter3": {
        "speaker": "系统",
        "text": "1952 年 1 月 4 日。三号墓位于一、二号墓之间稍偏南，规模最小，封土几乎被犁平。\n\n墓门粗糙，封门砖大小不一，有几块明显是从别处拆来的旧砖。\n\n墓室内壁无画，只有素面白灰。棺床上一具骨架，无棺。",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "chapter3_bones"
    },
    "chapter3_bones": {
        "speaker": "系统",
        "text": "骨架为女性，约四十至五十岁。\n\n左肩胛骨有一处明显增厚的骨痂——一枚锈蚀的铁箭头嵌在其中，方向自前向后。\n\n创口边缘的骨质增生表明：这枚箭，是箭主自己扎进去的，并且带伤生活了至少十年以上。",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "chapter3_puzzle_zhang"
    },
    "chapter3_puzzle_zhang": {
        "speaker": "粟柏年",
        "text": "“前向后入骨，箭尾朝前。这不是被射中。\n\n这是自己扎进去的。\n\n一个女人，为什么要把箭头扎进自己的肩膀，并且带着它活了十几年？”",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [
            {"text": "A. 战乱中误伤", "next": "chapter3_zhang_wrong"},
            {"text": "B. 自伤——为了把某样东西藏在伤口里", "next": "chapter3_zhang_right"},
            {"text": "C. 民间巫术", "next": "chapter3_zhang_wrong"}
        ], "next": None
    },
    "chapter3_zhang_wrong": {
        "speaker": "粟柏年",
        "text": "“误伤的话，箭一般会被取出来。带伤十年——这枚箭是她不让别人取出来的。\n\n再想想，她为什么要藏？”",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "chapter3_zhang_right"
    },
    "chapter3_zhang_right": {
        "speaker": "系统",
        "text": "箭头是个伪装。\n\n肩膀里塞着的，可能是一份要命的东西。靖康元年金兵南下，赵季平战死无棺，妻张氏只身南归——\n\n她在自己肩膀里藏了什么？\n\n墓中无符节、无文书。只有那枚锈蚀的铁箭头，和一具骨架。",
        "background_image": "static/images/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "chapter3_guanyu"
    },
    "chapter3_guanyu": {
        "speaker": "粟柏年",
        "text": "“一、二、三号墓的位置——一号最南，二号西北，三号中间偏南。\n\n这是贯鱼葬。父在前，子在后，孙更后，南为尊。\n\n所以——”",
        "background_image": "static/images/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [
            {"text": "一号墓主辈分最高", "next": "chapter3_guanyu_right"},
            {"text": "三号墓主辈分最高", "next": "chapter3_guanyu_wrong"}
        ], "next": None
    },
    "chapter3_guanyu_wrong": {
        "speaker": "粟柏年",
        "text": "“反了。贯鱼葬南为尊，最南最尊。一号墓最南——是祖父辈。”",
        "background_image": "static/images/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "chapter3_guanyu_right"
    },
    "chapter3_guanyu_right": {
        "speaker": "系统",
        "text": "一号：赵怀诚。\n二号：赵仲安（怀诚之子）。\n三号：应为仲安之子——赵季平。\n\n但三号墓里只葬着一个女人。男主人去了哪里？",
        "background_image": "static/images/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "chapter3_field"
    },
    "chapter3_field": {
        "speaker": "系统",
        "text": "1 月 10 日。地表踏勘。\n\n三座墓所在的台地南缘，散落瓷片三层：上层粗陶，中层青白瓷，最下层细白瓷。瓷质从精到粗，时代从早到晚。\n\n聚落在三代之内迅速衰微。\n\n台地东侧有一道下凹的旧河道，走向西北—东南。古河水曾从台地脚下流过，后来改道、干涸。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "chapter3_slip"
    },
    "chapter3_slip": {
        "speaker": "系统",
        "text": "你站在台地北面那棵半枯的老柏树下。\n\n粟柏年问：“这棵柏树有什么讲究？”\n\n你听见自己脱口而出——\n\n“北七步，柏树底下。”\n\n说完之后，你自己也愣住了。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "chapter3_sushi"
    },
    "chapter3_sushi": {
        "speaker": "粟柏年",
        "text": "夜里，他端着搪瓷缸子坐在你对面。\n\n“小林，墓里湿度高，真菌感染容易引起短时幻觉。\n\n田野工作做得越深，越容易把自己代入进去。我见过比你严重的——最优秀的田野工作者，都有过这种‘职业幻觉’。\n\n我不追问你看见了什么。我只想说，明天白天，我们再去北面那棵柏树底下，做一次正式的探沟。\n\n是真是假，铲子说了算。”",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "接受第三次穿越", "next": "travel3_open"}], "next": None
    },

    # ========== 第三次穿越 ==========
    "travel3_open": {
        "speaker": "系统",
        "text": "那天夜里，铜扣最后一次发热。\n\n这一次，你不是赵家任何一个人。\n\n你是一个无名的老妇人，蹲在土地庙后头，膝盖陷在湿冷的黄泥里。\n\n靖康二年的春天。金兵已经过了黄河。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "travel3_pickup"
    },
    "travel3_pickup": {
        "speaker": "系统",
        "text": "你看见地上躺着一个女人。她的左肩上插着一支断箭，箭头深陷在骨头里。她已经死了。\n\n她怀里掉出来一卷东西——一截铜符节，缠着染血的麻布。\n\n你伸出粗糙的、爬满褶皱的手，把符节捡起来。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "travel3_hide"
    },
    "travel3_hide": {
        "speaker": "老妇人",
        "text": "“这个不能让金兵见着。”\n\n你走进土地庙。神像底座有一道裂缝。你把符节裹紧，塞了进去，又用泥糊死。\n\n出庙的时候，你回头看了那女人一眼。\n\n“好闺女，你把命搭上的东西，俺给你藏好了。”",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "travel3_back"
    },
    "travel3_back": {
        "speaker": "系统",
        "text": "铜扣再没有热过。\n\n你回到 1 月 14 日的清晨。粟柏年带着两个民工已经站在北面那棵老柏树下了。\n\n探沟挖到第七步、约两米深的地方，铲子碰到一个东西——",
        "background_image": "static/images/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "final_box"
    },

    # ==================== 最后一日 ====================
    "final_box": {
        "speaker": "系统",
        "text": "一只锈蚀严重的铁匣。匣中有一卷麻纸家谱，并附后记数页。\n\n家谱起首四代：\n　赵远——北宋军户，靖康前殁，遗训：“当兵的要帮，逃荒的也要帮。”\n　赵怀诚——元符二年迁葬其父远于此，崇宁四年开仓三千石。\n　赵仲安——大观年间承枢密院密令北行军需，雁门防线。\n　赵季平——靖康元年战死无棺；妻张氏南归，自伤左肩护符节。",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "final_postscript"
    },
    "final_postscript": {
        "speaker": "张氏后记",
        "text": "末页是张氏的字，墨色已经发褐：\n\n　“汝以身护符，吾以箭护汝，虽阴阳两隔，此志不渝。”",
        "background_image": "static/images/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "final_temple"
    },
    "final_temple": {
        "speaker": "系统",
        "text": "下午，按家谱线索，你们找到了村北那座早已荒废的土地庙。\n\n神像底座的裂缝里，还嵌着半截铜符节，上面有干涸的麻布拓痕。\n\n年代、形制，与二号墓铜信牌可对照。\n\n那个无名老妇人，把承诺守了八百多年。",
        "background_image": "static/images/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "final_note"
    },
    "final_note": {
        "speaker": "系统",
        "text": "1952 年 3 月。报告初稿装订成册。\n\n粟柏年合上稿子，在最后一页右下角，用铅笔轻轻添了一行小字：\n\n　“见证者：林砚秋”\n\n他没有解释。你也没有问。",
        "background_image": "static/images/M1/16_出土器物与人骨/M1出土物分布图.png",
        "choices": [{"text": "2026 年秋", "next": "epilogue"}], "next": None
    },

    # ==================== 2026 尾声 ====================
    "epilogue": {
        "speaker": "系统",
        "text": "2026 年秋。北京。\n\n林砚秋——已经九十八岁——坐在窗下的藤椅里。孙女把一本新出的书放在她膝上：《白沙宋墓》纪念再版，封面素净。\n\n扉页上印着一行字：\n\n　“本故事纯属虚构。真实信息，以宿白先生《白沙宋墓》考古报告为准。”",
        "background_image": "static/images/entrance.png",
        "choices": [], "next": "epilogue_dialog"
    },
    "epilogue_dialog": {
        "speaker": "孙女",
        "text": "“奶奶，那个赵家——他们存在过吗？”\n\n老人没有立刻回答。她用指腹摩挲着扉页那行字，很久。",
        "background_image": "static/images/entrance.png",
        "choices": [], "next": "epilogue_line"
    },
    "epilogue_line": {
        "speaker": "林砚秋",
        "text": "“能被人记住，便是第二次活着。”",
        "background_image": "static/images/entrance.png",
        "choices": [{"text": "声明", "next": "disclaimer"}], "next": None
    },

    "disclaimer": {
        "speaker": "声明",
        "text": "本故事中的人物、家族、墓主姓名、家谱、绢帛、信牌、符节、穿越情节，均为虚构。\n\n白沙宋墓为真实考古发掘项目。1951 年 12 月至 1952 年 1 月，由宿白先生主持发掘于河南禹县白沙镇。考古报告《白沙宋墓》由文物出版社于 1957 年初版，2002 年再版，是中国宋代考古的奠基之作。\n\n关于墓葬的形制、年代、壁画内容等真实信息，请以宿白先生原报告为准。\n\n谨以此作，致敬所有于田野中默默工作的考古人。",
        "background_image": "static/images/rear-north.png",
        "choices": [{"text": "完", "next": "game_end"}], "next": None
    },
    "game_end": {
        "speaker": "系统",
        "text": "——完——",
        "background_image": "static/images/rear-north.png",
        "choices": [], "next": None
    }
}

# ==================== 路由 ====================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    # resume=1 表示从墓门解密返回，保持 session
    if request.args.get('resume') != '1':
        session.clear()
        session['current_dialogue'] = 'start'
        session['inventory'] = []
        session['flags'] = {}
    return render_template('game.html')

@app.route('/game/tomb_gate')
def tomb_gate():
    return render_template('tomb_gate.html', hotspots=TOMB_GATE_HOTSPOTS)

@app.route('/api/dialogue', methods=['POST'])
def dialogue_api():
    """一次性返回当前对话内容（不再流式打字）"""
    data = request.get_json() or {}
    choice_next = data.get('choice_next')
    if choice_next:
        session['current_dialogue'] = choice_next

    dialogue_id = session.get('current_dialogue', 'start')
    dialogue = get_dialogue(dialogue_id) or DIALOGUES['start']

    speaker, text, bg, portrait, next_id = apply_overrides(dialogue_id, dialogue)

    return jsonify({
        'id': dialogue_id,
        'speaker': speaker,
        'text': text,
        'choices': dialogue.get('choices', []),
        'next': next_id,
        'background_image': bg,
        'portrait': portrait,
        'puzzle': dialogue.get('puzzle'),
    })

@app.route('/api/puzzle/complete', methods=['POST'])
def puzzle_complete():
    """墓门解密完成，跳转到对应剧情节点"""
    data = request.get_json() or {}
    if data.get('puzzle') == 'tomb_gate':
        session['current_dialogue'] = 'door_examined'
    return jsonify({'status': 'ok', 'next': 'door_examined'})

@app.route('/api/dialogue/list')
def dialogue_list():
    """调试用：返回全部对话节点以供跳转"""
    items = []
    for nid, d in DIALOGUES.items():
        items.append({
            'id': nid,
            'speaker': d.get('speaker', ''),
            'preview': (d.get('text') or '').replace('\n', ' ')[:30],
            'has_choices': bool(d.get('choices')),
            'next': d.get('next'),
            'puzzle': d.get('puzzle'),
        })
    return jsonify({'current': session.get('current_dialogue', 'start'), 'nodes': items})

@app.route('/api/reset', methods=['POST'])
def reset():
    session.clear()
    return jsonify({'status': 'ok'})


# ==================== 后台：内容配置 ====================
@app.route('/admin/bg')
def admin_bg():
    return render_template('admin_bg.html')

@app.route('/api/admin/bg/data')
def admin_bg_data():
    """返回节点列表、默认值、覆盖值、生效值、可选图片。"""
    overrides = load_overrides()
    custom = overrides.get(CUSTOM_NODES_KEY, {}) or {}
    nodes = []
    # 原生节点
    for nid, d in DIALOGUES.items():
        ov = overrides.get(nid, {})
        eff_speaker = ov.get('speaker') or d.get('speaker', '')
        eff_text = ov.get('text') if ov.get('text') is not None else (d.get('text') or '')
        eff_bg = ov.get('bg') or d.get('background_image')
        eff_portrait = ov.get('portrait') or d.get('portrait')
        eff_next = ov.get('next') if ov.get('next') is not None else d.get('next')
        nodes.append({
            'id': nid,
            'is_custom': False,
            'default_speaker': d.get('speaker', ''),
            'default_text': d.get('text') or '',
            'default_bg': d.get('background_image'),
            'default_portrait': d.get('portrait'),
            'default_next': d.get('next'),
            'override_speaker': ov.get('speaker'),
            'override_text': ov.get('text'),
            'override_bg': ov.get('bg'),
            'override_portrait': ov.get('portrait'),
            'override_next': ov.get('next'),
            'effective_speaker': eff_speaker,
            'effective_text': eff_text,
            'effective_bg': eff_bg,
            'effective_portrait': eff_portrait,
            'effective_next': eff_next,
            'preview': eff_text.replace('\n', ' ')[:80],
            'has_choices': bool(d.get('choices')),
            'next': eff_next,
            'puzzle': d.get('puzzle'),
            'bg_locked': nid in BG_LOCKED_NODES,
        })
    # 自定义节点
    for nid, d in custom.items():
        eff_text = d.get('text') or ''
        nodes.append({
            'id': nid,
            'is_custom': True,
            'default_speaker': '',
            'default_text': '',
            'default_bg': None,
            'default_portrait': None,
            'default_next': None,
            'override_speaker': d.get('speaker'),
            'override_text': d.get('text'),
            'override_bg': d.get('bg'),
            'override_portrait': d.get('portrait'),
            'override_next': d.get('next'),
            'effective_speaker': d.get('speaker') or '',
            'effective_text': eff_text,
            'effective_bg': d.get('bg'),
            'effective_portrait': d.get('portrait'),
            'effective_next': d.get('next'),
            'preview': eff_text.replace('\n', ' ')[:80],
            'has_choices': False,
            'next': d.get('next'),
            'puzzle': None,
            'bg_locked': False,
        })
    return jsonify({
        'nodes': nodes,
        'images': list_image_assets(),
        'bg_locked_nodes': sorted(BG_LOCKED_NODES),
        'terminal_nexts': sorted(TERMINAL_NEXTS),
    })

def _node_to_dict(node_id):
    """返回某节点的完整生效状态字典（给 save 响应用）。"""
    overrides = load_overrides()
    custom = overrides.get(CUSTOM_NODES_KEY, {}) or {}
    if node_id in DIALOGUES:
        d = DIALOGUES[node_id]
        ov = overrides.get(node_id, {})
        return {
            'override_speaker': ov.get('speaker'),
            'override_text': ov.get('text'),
            'override_bg': ov.get('bg'),
            'override_portrait': ov.get('portrait'),
            'override_next': ov.get('next'),
            'effective_speaker': ov.get('speaker') or d.get('speaker', ''),
            'effective_text': ov.get('text') if ov.get('text') is not None else (d.get('text') or ''),
            'effective_bg': ov.get('bg') or d.get('background_image'),
            'effective_portrait': ov.get('portrait') or d.get('portrait'),
            'effective_next': ov.get('next') if ov.get('next') is not None else d.get('next'),
        }
    if node_id in custom:
        d = custom[node_id]
        return {
            'override_speaker': d.get('speaker'),
            'override_text': d.get('text'),
            'override_bg': d.get('bg'),
            'override_portrait': d.get('portrait'),
            'override_next': d.get('next'),
            'effective_speaker': d.get('speaker') or '',
            'effective_text': d.get('text') or '',
            'effective_bg': d.get('bg'),
            'effective_portrait': d.get('portrait'),
            'effective_next': d.get('next'),
        }
    return None

@app.route('/api/admin/bg/save', methods=['POST'])
def admin_bg_save():
    """保存覆盖。请求体：{node_id, field, value}。field 为 bg/speaker/text/portrait/next。value 为空字符串 = 重置。"""
    data = request.get_json() or {}
    node_id = data.get('node_id')
    field = data.get('field')
    value = data.get('value', '')
    if field not in ('bg', 'speaker', 'text', 'portrait', 'next'):
        return jsonify({'status': 'error', 'msg': 'invalid field'}), 400

    overrides = load_overrides()
    custom = overrides.get(CUSTOM_NODES_KEY, {}) or {}

    if not node_id or (node_id not in DIALOGUES and node_id not in custom):
        return jsonify({'status': 'error', 'msg': 'invalid node_id'}), 400
    if field == 'bg' and node_id in BG_LOCKED_NODES:
        return jsonify({'status': 'error', 'msg': 'bg locked for this node'}), 403

    # next 合法性校验：指向节点必须存在，或为终止值
    if field == 'next' and value:
        if value not in DIALOGUES and value not in custom and value not in TERMINAL_NEXTS:
            return jsonify({'status': 'error', 'msg': f'unknown next target: {value}'}), 400

    if node_id in custom:
        # 自定义节点：直接改本体
        node = custom[node_id]
        if value == '' or value is None:
            node.pop(field, None)
        else:
            node[field] = value
        custom[node_id] = node
        overrides[CUSTOM_NODES_KEY] = custom
    else:
        # 原生节点：走 overrides
        node_ov = overrides.get(node_id, {})
        if value == '' or value is None:
            node_ov.pop(field, None)
        else:
            node_ov[field] = value
        if node_ov:
            overrides[node_id] = node_ov
        else:
            overrides.pop(node_id, None)
    save_overrides(overrides)

    result = _node_to_dict(node_id) or {}
    result['status'] = 'ok'
    return jsonify(result)

@app.route('/api/admin/bg/create', methods=['POST'])
def admin_bg_create():
    """新建自定义节点。请求体：{node_id, speaker?, text?, next?}。"""
    data = request.get_json() or {}
    nid = (data.get('node_id') or '').strip()
    if not nid:
        return jsonify({'status': 'error', 'msg': 'node_id required'}), 400
    if not re.match(r'^[A-Za-z_][A-Za-z0-9_\-]*$', nid):
        return jsonify({'status': 'error', 'msg': 'node_id 只能含字母/数字/下划线/横杠，首字符为字母或下划线'}), 400
    if nid in TERMINAL_NEXTS:
        return jsonify({'status': 'error', 'msg': f'与保留终止值冲突: {nid}'}), 400
    overrides = load_overrides()
    custom = overrides.get(CUSTOM_NODES_KEY, {}) or {}
    if nid in DIALOGUES or nid in custom:
        return jsonify({'status': 'error', 'msg': '节点 id 已存在'}), 400
    new_node = {
        'speaker': data.get('speaker') or '',
        'text': data.get('text') or '',
    }
    nxt = data.get('next')
    if nxt:
        if nxt not in DIALOGUES and nxt not in custom and nxt not in TERMINAL_NEXTS:
            return jsonify({'status': 'error', 'msg': f'unknown next target: {nxt}'}), 400
        new_node['next'] = nxt
    custom[nid] = new_node
    overrides[CUSTOM_NODES_KEY] = custom
    save_overrides(overrides)
    return jsonify({'status': 'ok', 'node_id': nid})

@app.route('/api/admin/bg/delete', methods=['POST'])
def admin_bg_delete():
    """删除自定义节点。原生节点不可删。请求体：{node_id}。"""
    data = request.get_json() or {}
    nid = data.get('node_id')
    if not nid:
        return jsonify({'status': 'error', 'msg': 'node_id required'}), 400
    if nid in DIALOGUES:
        return jsonify({'status': 'error', 'msg': '原生节点不可删除'}), 403
    overrides = load_overrides()
    custom = overrides.get(CUSTOM_NODES_KEY, {}) or {}
    if nid not in custom:
        return jsonify({'status': 'error', 'msg': '节点不存在'}), 404
    # 检查是否被其他节点的 next 指向
    referenced_by = []
    for k, v in DIALOGUES.items():
        if v.get('next') == nid and overrides.get(k, {}).get('next') is None:
            referenced_by.append(k)
    for k, ov in overrides.items():
        if k == CUSTOM_NODES_KEY: continue
        if isinstance(ov, dict) and ov.get('next') == nid:
            referenced_by.append(k)
    for k, v in custom.items():
        if k != nid and v.get('next') == nid:
            referenced_by.append(k)
    if referenced_by:
        return jsonify({'status': 'error', 'msg': f'仍被以下节点引用: {", ".join(referenced_by[:5])}'}), 409
    custom.pop(nid, None)
    overrides[CUSTOM_NODES_KEY] = custom
    save_overrides(overrides)
    return jsonify({'status': 'ok'})

@app.route('/api/admin/bg/export')
def admin_bg_export():
    return jsonify(load_overrides())

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    print(f"\n  白沙尘烟 · 启动于 http://localhost:{port}\n")
    app.run(host='0.0.0.0', port=port, debug=True, threaded=True)

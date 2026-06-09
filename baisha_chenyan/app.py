#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory
import os, json, re

app = Flask(__name__)
app.secret_key = 'baisha-chenyan-archaeology-2024'

# ==================== 内容覆盖配置 ====================
OVERRIDES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'content_overrides.json')
LEGACY_BG_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bg_overrides.json')
# 锁定节点：含交互式谜题，背景不允许修改（文本/speaker 仍可改）
BG_LOCKED_NODES = set()
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

# 人物立绘映射（speaker -> 图片路径）
SPEAKER_PORTRAITS = {
    '周淼': 'static/images/portraits/周淼.png',
    '林砚秋': 'static/images/portraits/林砚秋.png',
    '粟柏年': 'static/images/portraits/粟柏年.png',
    '苏池': 'static/images/portraits/苏池.png',
    '赵老倔': 'static/images/portraits/赵老倔.png',
    '陈怀远': 'static/images/portraits/陈怀远.png',
}

def apply_overrides(node_id, dialogue):
    """返回叠加覆盖后的 (speaker, text, bg, portrait, next_id)。portrait 可为 None。"""
    overrides = load_overrides().get(node_id, {})
    speaker = overrides.get('speaker') or dialogue.get('speaker', '')
    text = overrides.get('text') if overrides.get('text') is not None else dialogue.get('text', '')
    bg = overrides.get('bg') or dialogue.get('background_image')
    portrait = overrides.get('portrait') or dialogue.get('portrait')
    # 如果对话数据中没有指定 portrait，按 speaker 自动匹配立绘
    if not portrait:
        portrait = SPEAKER_PORTRAITS.get(speaker)
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
    """扫描 static/images 和 assets 下的所有图片，按目录分组返回"""
    groups = {}
    exts = {'.png', '.jpg', '.jpeg', '.webp'}
    app_dir = os.path.dirname(os.path.abspath(__file__))
    # 扫描 static/images
    base = os.path.join(app_dir, 'static', 'images')
    if os.path.exists(base):
        for root, _, files in os.walk(base):
            for fn in files:
                if os.path.splitext(fn)[1].lower() not in exts:
                    continue
                full = os.path.join(root, fn)
                rel = os.path.relpath(full, app_dir).replace(os.sep, '/')
                group = os.path.relpath(root, base).replace(os.sep, '/') or '(root)'
                groups.setdefault(group, []).append(rel)
    # 扫描 assets (M1 图片)
    assets_base = os.path.join(app_dir, '..', 'assets')
    if os.path.exists(assets_base):
        for root, _, files in os.walk(assets_base):
            for fn in files:
                if os.path.splitext(fn)[1].lower() not in exts:
                    continue
                full = os.path.join(root, fn)
                rel = os.path.relpath(full, os.path.join(app_dir, '..')).replace(os.sep, '/')
                group = os.path.relpath(root, assets_base).replace(os.sep, '/') or '(root)'
                groups.setdefault(group, []).append(rel)
    for g in groups:
        groups[g].sort()
    # portraits/ 子目录置顶
    def _sort_key(item):
        g = item[0]
        return (0 if g.startswith('portraits') else 1, g)
    return dict(sorted(groups.items(), key=_sort_key))

# ==================== 对话数据 ====================
# ==================== 对话数据（新剧情） ====================
DIALOGUES = {
    # ===== 楔子 =====
    "start": {
        "speaker": "系统",
        "text": "这是你第一次见到白沙。\n\n你坐了六个小时的卡车，又在驴车上颠了两个钟头，才在一片铅灰色的冬日天空下，望见了几棵老槐树掩映的土房。河南，禹县，白沙镇。一个在地图上几乎找不到名字的地方，可你的外祖父来过。",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "arrive_village"
    },
    "arrive_village": {
        "speaker": "系统",
        "text": "十二月的华北平原，风裹着干燥的尘土扑面而来。你紧了紧灰蓝列宁装的领口，手指碰到一根细细的皮绳。皮绳上系着一枚银怀表链扣，圆形，比铜钱略大，银质表面布满细密裂纹。那是外祖父的遗物，从你记事起就挂在颈间，没摘下来过一天。\n\n母亲说，外祖父生前把这枚银扣挂在怀表链上。1938年他在南迁途中病逝，银扣回到母亲手里时，表已经没了，链子也断了，只剩这一枚扣子。",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "meet_zhou"
    },
    "meet_zhou": {
        "speaker": "周淼",
        "text": "“林同志！”\n\n一个扎两根麻花辫的姑娘朝你快步走来，圆脸上有浅浅的雀斑，杏仁眼很灵动，眼尾略微下垂。她穿一件藏蓝色列宁装女式改良版，收腰设计，领口别着一枚小小的梅花胸针。她接过你手里的帆布包，笑着说：\n\n“我是周淼，负责壁画与纹饰测绘。粟老师在镇上供销社给你留了饭，让你今晚好好歇着，明天——”",
        "background_image": "assets/entrance.png",
        "choices": [{"text": "“明天什么时候开工？”", "next": "ask_work_time"}], "next": None
    },
    "ask_work_time": {
        "speaker": "周淼",
        "text": "她愣了一下。“五点半。”",
        "background_image": "assets/entrance.png",
        "choices": [{"text": "“那麻烦你带我直接去工地吧。”", "next": "go_to_site"}], "next": None
    },
    "go_to_site": {
        "speaker": "系统",
        "text": "周淼微微睁大了眼，张了张嘴，最终只是点了点头。她转身带路时，你注意到她的裤腿用皮筋扎紧，脚上一双黑色圆头布鞋，鞋面沾着洗不掉的红褐色铁锈痕。\n\n你们穿过村子，爬上一道缓坡。坡顶上，那片隆起的高地出现在暮色里。一个瘦高的身影蹲在土台边上，手电光在暮色中晃动。他穿了一身洗得发白的深灰色列宁装，背对着你，用放大镜一寸一寸地看着什么。",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "meet_su_teacher"
    },
    "meet_su_teacher": {
        "speaker": "周淼",
        "text": "“粟老师，林助教到了。”",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "river_question"
    },
    "river_question": {
        "speaker": "粟柏年",
        "text": "粟柏年朝你的方向推了推鼻梁上的黑框圆眼镜。长脸，颧骨略高，皮肤偏黑，眼窝微凹，嘴角自然下垂，语气平和。\n\n“路上看见那条干河道了吗？”\n\n“……看见了。”\n\n“什么走向？”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [
            {"text": "东北—西南", "next": "river_wrong"},
            {"text": "西北—东南", "next": "river_correct"},
            {"text": "东南—西北", "next": "river_wrong"}
        ], "next": None
    },
    "river_wrong": {
        "speaker": "粟柏年",
        "text": "他微不可见地皱了下眉头。“地形勘测在考古过程中也是很重要的一步。那条干河道是西北到东南走向。下次路过的时候，多看一眼。”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "teacher_intro"
    },
    "river_correct": {
        "speaker": "粟柏年",
        "text": "“嗯。观察得很仔细。明天早上五点半，在这个位置，先看墓道。”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "teacher_intro"
    },
    "teacher_intro": {
        "speaker": "系统",
        "text": "他站起来，身体重心微微前移，像随时准备往前走、往下看。深灰色列宁装的领口磨得起了毛边，袖口打着细致的手缝补丁。\n\n粟柏年，29岁，北大考古专业青年教师，也是你接下来的领队老师。",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "env_team"
    },
    "env_team": {
        "speaker": "系统",
        "text": "他领你往工地里面走了一段。探方边上支着几盏马灯，一个中年人正坐在帆布棚下伏案绘图，国字脸，花白的头发浓密。外罩一件军绿色帆布工装马甲，上面插满了比例尺、铅笔和手电筒。\n\n“陈怀远，陈工。建筑结构测绘。”\n\n陈怀远从老花镜上方看了你一眼，点了个头，继续画图。\n\n棚子另一角蹲着个壮实的村民，宽肩膀，罗圈腿，一身黑色粗布对襟短褂敞着扣子。头上系着一条白毛巾，额头三道很深的抬头纹。他正用磨刀石磨着铁锹刃。\n\n“赵广田师傅，村里人都叫他老倔。发掘技工。”\n\n赵老倔眯着眼看了你一眼，把你从头到脚打量了一遍，然后“哼”了一声。“又是个读书的。”",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [{"text": "继续往里看", "next": "env_team_2"}], "next": None
    },
    "env_team_2": {
        "speaker": "系统",
        "text": "棚子最里面亮着一盏小灯，一个戴圆框眼镜的年轻人正伏在矮桌边。圆脸，皮肤白，手指细长。桌上摊着几块用纱布包好的骨骼标本。他正用游标卡尺量一块髋骨碎片。\n\n“苏池，体质人类学。他负责骨骼鉴定。”\n\n苏池朝你点了一下头，手没离开游标卡尺，声音很低。“你好。”\n\n粟柏年：“休息吧。明天会很累。”",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [{"text": "第一章：墓外", "next": "env_morning"}], "next": None
    },

    # ===== 墓外 =====
    "env_morning": {
        "speaker": "系统",
        "text": "天还没亮透，风从华北平原的枯槁田野上刮过来，像一把钝锯子在骨头缝里来回拉。你跟着粟柏年爬上缓坡，工地在晨色里显出轮廓：几片探方，几盏马灯，帆布棚子被风吹得哗哗响。\n\n粟柏年停在高地边缘，从口袋里掏出一张折叠整齐的坐标纸，在晨雾里抖开。纸上是白沙宋墓群的平面草图，M1在最南端，靠近水库取土区的边缘。",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "env_map"
    },
    "env_map": {
        "speaker": "粟柏年",
        "text": "“先看大局。”他把草图摊在一块平整的夯土断面上，用两块碎砖压住边角。图纸右上角印着一行小字：“白沙附近图”，标出了白沙镇、禹县、颖水的相对位置，水库工程取土区用斜线阴影标出，M1就在那片阴影的边缘。\n\n“白沙镇在这个位置。墓群坐落在这道南北向土岗的东坡，海拔比周围农田高出约十五米。东南高，西北低。土岗北侧那条干涸的河道——西北到东南走向。M1是第一批暴露出来的，但未必是最早建的。”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "env_map_2"
    },
    "env_map_2": {
        "speaker": "系统",
        "text": "你凑过去。图纸上画着一道蜿蜒的虚线，从镇子边缘延伸过来，绕过一片洼地，攀上土岗。虚线旁边标了一行小字：“1940年勘测路线”。\n\n“这是……”\n\n“你外祖父。1940年，他随历史所调查组来过白沙。这条线是他手绘的。”他没看你，铅笔在M1的符号旁画了一条轴线，“墓道→墓门→甬道→前室→过道→后室。六个节点，像一串被埋在地下的链扣。同一座墓，两代人。这不常见。”\n\n手指碰到领口里的银扣，皮绳被体温焐得发软。",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "env_map_3"
    },
    "env_map_3": {
        "speaker": "粟柏年",
        "text": "“待会儿你要进的是一座完整的墓。不是单个谜题，是一个从外到内的空间系统。每走一步，前面的发现都会重新被后面的证据检验。”\n\n他把草图折好，塞回口袋，抬头看了你一眼。\n\n“现在，把白沙位置、墓群范围和这条空间序列标在你的记录本上。顺序别乱。”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "env_map_question"
    },
    "env_map_question": {
        "speaker": "系统",
        "text": "你在笔记上画下三个框：位置图、范围图、序列轴。\n\n在标注墓群范围时，你注意到土岗西北角还有一片未探明的空白区。怎么处理？",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [
            {"text": "标出“待探区”，注明目前无证据", "next": "env_map_answer_a"},
            {"text": "推测那里可能还有墓葬，画虚线框", "next": "env_map_answer_b"},
            {"text": "问问粟老师，空白区是不是已经被挖过了", "next": "env_map_answer_a"}
        ], "next": None
    },
    "env_map_answer_b": {
        "speaker": "粟柏年",
        "text": "他看了一眼你的图。“虚线框可以画，但要注明是推测。现在没有任何探孔数据支持这个推测。考古报告里，推测和可判断之间必须画线。”\n\n他在你画的虚线框旁边写了两个字：“待核。”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "env_zhang"
    },
    "env_map_answer_a": {
        "speaker": "粟柏年",
        "text": "“对。没有探孔数据的地方，标‘待探’或‘待核’。不能凭地形相似就补画墓葬。”",
        "background_image": "assets/M1/01环境地图/白沙宋墓地形图.png",
        "choices": [], "next": "env_zhang"
    },
    "env_zhang": {
        "speaker": "系统",
        "text": "赵老倔扛着铁锹走上来，走到坡顶忽然停下脚步，用锹柄敲了敲脚下的地面，又侧耳听了听。他蹲下去，抓起一把土在掌心搓了搓。\n\n“这一片夯过。土色发黏，有石灰。下面三尺，应该是墓道的填土。”\n\n粟柏年：“赵师傅的脚，比洛阳铲快。M1的墓道已经清出来了。今天先从墓门开始。”",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [], "next": "env_zhou_sketch"
    },
    "env_zhou_sketch": {
        "speaker": "系统",
        "text": "转身往工地走的时候，周淼从后面赶上来，把一张薄纸塞到你手里。\n\n“这是我昨晚凭记忆画的。比例不准，但空间关系大致对。你带着，进墓的时候有个底。”\n\n你低头看图。墓道、墓门、甬道、前室、过道、后室——六个空间沿着一条微微偏斜的轴线依次排开，像一句没有说完的话。",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [{"text": "第一章：墓门", "next": "gate_approach"}], "next": None
    },

    # ===== 墓门 =====
    "gate_approach": {
        "speaker": "系统",
        "text": "墓道口在土岗东坡的断层上切出一道规整的开口。粟柏年已经蹲在那儿了，手电光在晨雾里切出一道白柱，照在阶梯夯土的断面上。墓道北偏东十五度，现存长度将近六米。阶梯现存十一级。平坦部分将近两米。\n\n“夯层每层十五公分，夯窝直径八公分。北宋中晚期的做法。徽宗以后就不这么仔细了。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_hang_question"
    },
    "gate_hang_question": {
        "speaker": "系统",
        "text": "赵老倔蹲在一边，嘴里叼着旱烟袋。\n\n“粟老师，你连夯窝大小都能量出来？”\n\n粟柏年：“你踩得出来地下有没有空洞。这比量夯窝难。”\n\n“那是。俺的脚底板比眼睛好使。”\n\n【粟柏年为什么让你先看夯层？】",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [
            {"text": "判断墓道的年代和建造工艺", "next": "gate_hang_correct"},
            {"text": "寻找盗洞的痕迹", "next": "gate_hang_wrong"},
            {"text": "确认墓道的坡度是否符合宋代规制", "next": "gate_hang_wrong"}
        ], "next": None
    },
    "gate_hang_wrong": {
        "speaker": "粟柏年",
        "text": "“盗洞的痕迹不用在夯层里找，坡度也不是今天要判断的重点。夯层的厚度和夯窝的尺寸才是断代线索。先看地层，再想别的。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_bricks"
    },
    "gate_hang_correct": {
        "speaker": "粟柏年",
        "text": "“对。北宋中晚期的墓道夯土通常就是这个规格。徽宗以后战乱多，工艺反而没那么规矩了。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_bricks"
    },
    "gate_bricks": {
        "speaker": "系统",
        "text": "墓道尽头，封门砖露出来了。青灰色的砖墙，共三层。\n\n“外层横砖加菱角牙子混砌。中层全部横砖。内层全部卧丁砖。你看这三层，拆的顺序应该是什么？”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [
            {"text": "先外层，再中层，最后内层", "next": "gate_brick_correct"},
            {"text": "先内层，再中层，最后外层", "next": "gate_brick_wrong1"},
            {"text": "先中层，再外层，最后内层", "next": "gate_brick_wrong2"}
        ], "next": None
    },
    "gate_brick_wrong1": {
        "speaker": "粟柏年",
        "text": "“你想想——内层卧丁砖直接承受墓室内部的压力。如果先拆内层，外层和中层的侧向支撑一撤，内层往哪个方向卸力？整个封门会从里往外塌。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_brick_correct"
    },
    "gate_brick_wrong2": {
        "speaker": "粟柏年",
        "text": "“中层夹在中间，你怎么够得到？先拆外层，中层才能暴露。外层混合砌法最不稳定，先把它拆掉，内层还有中层抵着。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_brick_correct"
    },
    "gate_brick_correct": {
        "speaker": "粟柏年",
        "text": "“正确。理由？”\n\n（你）：“外层混合砌法最不稳定。先拆它，内层还有中层抵着。反过来就不行。”\n\n“正确。拆之前，先把最正中那块砖拓下来。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_yongan"
    },
    "gate_yongan": {
        "speaker": "系统",
        "text": "你取出宣纸和拓包，蹲在砖前。砖面上刻着两个字：永安。拓包蘸墨，先在废纸上扑几遍，墨色匀了才上纸。\n\n粟柏年站在你身后看了看拓片。\n\n“‘永安’。你觉得是什么？",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [
            {"text": "祝福语，取“永远平安”之意", "next": "gate_yongan_ab"},
            {"text": "墓主生前居住的宅子叫永安堂", "next": "gate_yongan_ab"},
            {"text": "目前无法判断，需要更多线索", "next": "gate_yongan_c"}
        ], "next": None
    },
    "gate_yongan_ab": {
        "speaker": "粟柏年",
        "text": "“有这种可能性。但我们还需要更多线索。”他在自己的记录本上写了“永安”二字，旁边打了个问号。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_team_banter"
    },
    "gate_yongan_c": {
        "speaker": "粟柏年",
        "text": "粟柏年看了你一眼，目光里有一丝不易察觉的赞许。\n\n“存疑。先别写进结论。这两个字的意思，后面会有线索来印证。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_team_banter"
    },
    "gate_team_banter": {
        "speaker": "系统",
        "text": "封门砖从外层开始逐块拆除。陈怀远负责绘制封门砖的正视图，鼻梁上架着老花镜，一手按着坐标纸，运笔极稳。\n\n他忽然极低地哼了一句什么，调门起得很高，又陡然拐了个弯。赵老倔手里撬棍一顿，头也不抬。\n\n“老陈，你这嗓子，半夜能叫魂。”\n\n陈怀远没接话，老花镜后面的嘴角动了动，铅笔没停。周淼悄悄跟你使了个眼色——陈工高兴的时候才哼半句。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_team_question"
    },
    "gate_team_question": {
        "speaker": "赵老倔",
        "text": "赵老倔用撬棍撬起一块菱角牙子，歪头看了看墓砖的断面。\n\n“这砖烧得透，火候足。烧一窑这样的砖，得废多少柴火。你说这人啊，活着的时候住砖房，死了还要住砖房，图啥呢？”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [
            {"text": "“赵师傅，你家用的什么砖？”", "next": "gate_team_a"},
            {"text": "笑笑不说话，继续低头编号", "next": "gate_team_b"},
            {"text": "“九百年了，烧它的人早没了，它还在”", "next": "gate_team_c"}
        ], "next": None
    },
    "gate_team_a": {
        "speaker": "赵老倔",
        "text": "赵老倔从嘴里抽出旱烟袋，在鞋底磕了两下。“俺家是土坯砖，自己打的。哪用得起烧窑砖。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack"
    },
    "gate_team_b": {
        "speaker": "系统",
        "text": "你低头继续编号。赵老倔也不在意，又撬下一块砖，这次是对着砖说的。\n\n“九百年了。烧你的人早没了，你还在这儿。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack"
    },
    "gate_team_c": {
        "speaker": "赵老倔",
        "text": "赵老倔愣了一下，旱烟袋停在嘴边。他歪头看了你一眼，然后“嘿”了一声。\n\n“你这丫头，说话跟俺村东头算命的老王头似的。”\n\n他把撬棍插进下一块砖缝里，忽然又停了一下。“不过你说得对。烧它的人早没了，它还在这儿。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack"
    },
    "gate_crack": {
        "speaker": "系统",
        "text": "你透过刚取下的一块菱角牙子留下的砖孔往里看了一眼。手电光穿过中层横砖的灰缝，照到最内层卧丁砖的砖面上——一道细细的阴影从砖的右上角延伸到左下角，周围还有几道细小的分支纹路。\n\n裂缝。不足一毫米，但已经贯穿了整块卧丁砖。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack_question"
    },
    "gate_crack_question": {
        "speaker": "粟柏年",
        "text": "“你觉得接下来怎么做？",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [
            {"text": "继续拆，裂缝不大，应该不会有大问题", "next": "gate_crack_continue"},
            {"text": "停。先架支撑", "next": "gate_crack_stop"},
            {"text": "我去叫陈工来看看，他经验丰富", "next": "gate_crack_chen"}
        ], "next": None
    },
    "gate_crack_continue": {
        "speaker": "系统",
        "text": "粟柏年伸手按住你正准备递给赵老倔的下一块砖号，力道很轻，但很确定。\n\n“裂缝的宽度不到一毫米。但它在内层卧丁砖上——这块砖直接承受墓室内部的压力。墓道填土清掉以后，外侧的土压力消失了。如果墓室内部有局部坍塌，内层承担的力已经不均匀了。继续拆外层，这条裂缝会往哪个方向走？”\n\n他松开手，把决定权留给你。你沉默了几秒，对赵老倔说先停一下。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack_support"
    },
    "gate_crack_chen": {
        "speaker": "粟柏年",
        "text": "“可以。”\n\n陈怀远放下绘图板走过来，蹲在砖孔前看了看。老花镜挂在胸口，他眯着眼看了很久，站起来，只说了两个字。\n\n“架撑。”\n\n粟柏年随即朝坡下喊赵师傅备木料。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack_support"
    },
    "gate_crack_stop": {
        "speaker": "粟柏年",
        "text": "“好。”\n\n他转身朝坡下喊赵师傅备立柱和过梁。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack_support"
    },
    "gate_crack_support": {
        "speaker": "系统",
        "text": "赵老倔扛着木料过来，扎稳马步，双手托着立柱往上一顶，腮帮子鼓起，脖子上青筋跳了一下。立柱架好之后，裂缝没有扩大。\n\n陈怀远从绘图板后面走出来，手里捏着皮卷尺，量了量立柱和过梁的夹角，又用手指敲了敲木料。\n\n“稳了。”",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_crack_after"
    },
    "gate_crack_after": {
        "speaker": "系统",
        "text": "粟柏年在那块砖的编号旁边用红笔圈了个圈，在备注栏写了一行字。你后来在正式记录里读到：“取砖前外层支撑已撤除三分之一，裂缝未扩展。推测应力来自墓室内部崩毁的北壁。”\n\n取下那块卧丁砖以后，你翻过来看。裂缝已经深入砖厚的一半。它被外层和中层压住，压了九百年。",
        "background_image": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
        "choices": [], "next": "gate_door_reveal"
    },
    "gate_door_reveal": {
        "speaker": "系统",
        "text": "封门砖全部拆除。粟柏年拿起手电，第一个跨过墓门。\n\n你跟在他身后。手电光束从甬道顶部扫过。两扇版门通刷赭色，颜色沉得像凝固的血。每扇砌门钉七排，每排五钉。版门下缘距地面留有不到两指宽的空间，是宋代“断砌造”的遗痕。\n\n粟柏年停在版门前，手电光没有照正面，而是往上抬，照向门额背面。\n\n“砚秋，上来。”\n\n门额背面的砖面上，有一幅彩画。颜色已经褪了大半，但还能看出赭红色的云气纹和几点残留的石青色。线条是随手勾上去的，不像正面门额那样工整，却更自由。\n\n“正面是规矩，背面是自由。一座墓门，两面信息——‘背面也有信息’，这是本次调查的第一个方法收获。”",
        "background_image": "assets/M1/02墓道与墓门/插图三九 第一号墓墓门门额背面彩画.png",
        "choices": [], "next": "corridor_start"
    },

    # ===== 甬道 =====
    "corridor_start": {
        "speaker": "系统",
        "text": "你们跨过墓门，进入甬道。顶部用横砖叠涩内收，一层一层向中心聚拢，每层砖都比下一层往内缩进几寸。最顶心画着赭黄二色的叠胜图案，两个菱形相叠，线条简洁。\n\n周淼站住了，仰头看了很久。她举起炭笔对着顶心比了比。“这个叠胜和《营造法式》里的罗纹叠胜比起来简化了不少，颜色保存得真好。”",
        "background_image": "assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png",
        "choices": [], "next": "corridor_chen"
    },
    "corridor_chen": {
        "speaker": "陈怀远",
        "text": "陈怀远从她身后走过去，用手电在顶部扫了一道。\n\n“三面叠涩，横砖收顶。八层。内收弧度比正常的缓。最下面两层叠涩的砖角磨得比上面圆——可能是下葬时抬棺，棺底蹭的。”",
        "background_image": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
        "choices": [], "next": "corridor_sanitation"
    },
    "corridor_sanitation": {
        "speaker": "粟柏年",
        "text": "粟柏年蹲在版门前面，用手铲尖端轻轻点了点版门下缘的空隙。\n\n“《营造法式》里叫‘断砌门’，不用地栿，门砧直接卧在砖地面上。北宋中期以后才流行起来。砚秋，记一下。甬道版门，断砌造。门钉七排五钉，和《营造法式》规定的‘版门门钉排五钉’吻合。”\n\n他站起来，手电光从顶部移向东壁。\n\n“别只往前走，抬头看顶部，侧看两壁。东壁绘有司阍与持贡品的侍者，面向墓门方向；西壁同样绘有司阍，旁有马匹和捧酒壶的侍者。两侧壁面共同构成‘过渡与引导’的图像程序。甬道不是让你走的，是让你学会怎么看的。”",
        "background_image": "assets/M1/03甬道/第一号墓甬道东壁壁画（彭华士摄）.png",
        "choices": [], "next": "corridor_question"
    },
    "corridor_question": {
        "speaker": "系统",
        "text": "【粟柏年为什么让你三面合读？】",
        "background_image": "assets/M1/03甬道/第一号墓甬道东壁壁画（彭华士摄）.png",
        "choices": [
            {"text": "三面壁画合在一起才能看懂甬道的整体装饰主题", "next": "corridor_wrong"},
            {"text": "考古观察不能只盯着一个方向，顶部、侧壁、正面都要看", "next": "corridor_correct"},
            {"text": "东壁和西壁的壁画内容有矛盾，需要对照", "next": "corridor_wrong"}
        ], "next": None
    },
    "corridor_wrong": {
        "speaker": "粟柏年",
        "text": "“主题和对照都不是重点。重点是方法：进到一个封闭空间，先定位置，再看顶部，然后扫两侧壁。三面信息合起来，才能判断这个空间在整座墓里承担什么功能。”",
        "background_image": "assets/M1/03甬道/第一号墓甬道东壁壁画（彭华士摄）.png",
        "choices": [], "next": "corridor_zhou"
    },
    "corridor_correct": {
        "speaker": "粟柏年",
        "text": "“对。考古观察不是看画，是读空间。顶部给你方向，侧壁给你内容。三面合读，才能判断甬道是单纯的通道，还是在引导你进入前室。”",
        "background_image": "assets/M1/03甬道/第一号墓甬道东壁壁画（彭华士摄）.png",
        "choices": [], "next": "corridor_zhou"
    },
    "corridor_zhou": {
        "speaker": "系统",
        "text": "周淼把画板竖起来，铅笔在纸上沙沙地画。她先勾了顶部的叠胜轮廓，然后在旁边分两栏，一栏记东壁人物，一栏记西壁人物。\n\n“东壁司阍面向墓门，西壁马匹面向前室……两边都在把人往前推。”\n\n粟柏年：“记录这个判断。但不要写‘引导灵魂进入’——那是后来的说法。我们只记录图像的朝向和位置关系。”",
        "background_image": "assets/M1/03甬道/第一号墓甬道西壁壁画(彭华士摄).png",
        "choices": [{"text": "第一章：前室", "next": "front_hall"}], "next": None
    },

    # ===== 前室 =====
    "front_hall": {
        "speaker": "系统",
        "text": "穿过甬道，前室豁然开朗。手电光先照到了穹窿顶上的扁方形宝盖式盝顶藻井。垂旒相间用赭、青、黄、白四色，盝顶坡面上画着柿蒂纹和覆莲，顶心是绛青二色的叠胜。藻井四角的弧线柔和而精准。",
        "background_image": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "front_hall_chen"
    },
    "front_hall_chen": {
        "speaker": "陈怀远",
        "text": "陈怀远站在前室正中，仰头看着穹窿顶，手里皮卷尺的一端垂在地面。他量了量盝顶四角的弦长，后退半步，眯起一只眼，像木匠看梁是否端正。\n\n“四角起翘的弧度不一样。西北角比东南角缓了半寸。不是匠人失手，是地基沉降。九百年，土往下走了。”",
        "background_image": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "front_hall_walls"
    },
    "front_hall_walls": {
        "speaker": "系统",
        "text": "粟柏年的手电在顶心停了一下，缓缓下落，扫过四壁。\n\n北壁是夫妇对坐图。男子面容饱满，蓄须，戴幞头，穿圆领袍。女子梳高髻，着对襟褙子。两人袖手而坐，身后各有一扇屏风。桌上有酒注、注碗、台盏、经瓶。\n\n东壁是女乐图。卷帘下，女乐十一人分左右两组。右侧五人击鼓、击拍板、击腰鼓、吹横笛、吹觱篥。左侧五人吹箫、吹笙、吹排箫、弹琵琶。四排乐人之间，一人戴硬脚花额幞头，欠身扬袖作舞。\n\n西壁是墓主夫妇对坐像，用砖砌浮出壁面约五到十厘米。男袖手坐右侧，戴蓝帽，着圆领蓝袍。女袖手坐左侧，梳高髻方额，着绛襦白裙。二人皆侧身面东，观看东壁的乐舞。",
        "background_image": "assets/M1/05_前室_西壁/. 第一号墓前室西壁壁画(原色版，彭华士摄).png",
        "choices": [], "next": "front_hall_kaifang"
    },
    "front_hall_kaifang": {
        "speaker": "粟柏年",
        "text": "“这是墓主人夫妇。东壁的乐和西壁的宴合在一起，就是‘开芳宴’。《醉翁谈录》里记的，宋人夫妇宴饮，常开芳宴，表夫妻相爱。注意看壁画的层次，西壁中心是砖砌的，桌椅、注子都是浮出壁面的。但屏风和侍者是画的。同一个场景，用了两种技法。你觉得为什么？”",
        "background_image": "assets/M1/05_前室_西壁/第一号墓前室西壁壁画中砖砌桌及其侧面.png",
        "choices": [
            {"text": "墓主人夫妇是中心，用浮雕凸显其核心地位", "next": "front_hall_kaifang_correct"},
            {"text": "可能是两个不同的工匠团队分别完成的", "next": "front_hall_kaifang_wrong"},
            {"text": "砖浮雕更省钱，所以只做了墓主人夫妇", "next": "front_hall_kaifang_wrong"}
        ], "next": None
    },
    "front_hall_kaifang_wrong": {
        "speaker": "粟柏年",
        "text": "“桌椅的浮雕和侍者的壁画在风格上是统一的，同一个人设计的。至于省钱，砖浮雕的工费不比画工低。技法不同，不是因为成本。”",
        "background_image": "assets/M1/05_前室_西壁/第一号墓前室西壁壁画中砖砌桌及其侧面.png",
        "choices": [], "next": "front_hall_kaifang_correct"
    },
    "front_hall_kaifang_correct": {
        "speaker": "粟柏年",
        "text": "“砖浮雕的立体感让墓主人夫妇浮出壁面，被固定在中心位置，不容忽视。侍者和背景退到平面里，是陪衬。这种主次关系，就是宋人墓葬装饰的逻辑。”",
        "background_image": "assets/M1/05_前室_西壁/第一号墓前室西壁壁画中砖砌桌及其侧面.png",
        "choices": [], "next": "front_hall_screen"
    },
    "front_hall_screen": {
        "speaker": "系统",
        "text": "你走到北壁前。侧光下，屏风山水画的颜料龟裂处，似乎浮出了一些极细的墨线。你凑得更近，手电从侧面打过去——\n\n粟柏年的手电光忽然打在你肩上。\n\n“砚秋。前室不能只看最漂亮或最醒目的画面。人物、器物、入口和顶部结构要放在同一张复查表里。屏风上的细节，等全部壁面记录完再细看。”\n\n你退后一步。那些墨线还在，但粟柏年说得对，现在不是追单个细节的时候。",
        "background_image": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
        "choices": [{"text": "第一章：过道", "next": "passage"}], "next": None
    },

    # ===== 过道 =====
    "passage": {
        "speaker": "系统",
        "text": "穿过前室南壁的短甬，空间忽然窄下来。墙壁从四面收拢，顶部的宝盖式盝顶变成更紧凑的丁字形收束。\n\n周淼：“前室之后，空间忽然窄下来。尽头更暗。”\n\n她下意识往你身后退了半步。",
        "background_image": "assets/M1/09_过道/第一号墓前室、过道顶一一丁字盗顶式宝盖(原色版，彭华士摄).png",
        "choices": [], "next": "passage_inscription"
    },
    "passage_inscription": {
        "speaker": "系统",
        "text": "粟柏年的手电停在东壁。壁上有一行墨书，八个字，一笔一划，在赭红色的底色上显得格外清晰。\n\n“元符二年赵大翁布。”\n\n粟柏年把手电的光斑定在那行字上，沉默了很久。",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [], "next": "passage_q1"
    },
    "passage_q1": {
        "speaker": "粟柏年",
        "text": "“这行题记告诉我们什么？”",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [
            {"text": "墓的年代是元符二年，墓主姓赵", "next": "passage_q1_correct"},
            {"text": "题记是后来的人写上去的", "next": "passage_q1_wrong"},
            {"text": "这只是一位工匠的名字", "next": "passage_q1_wrong"}
        ], "next": None
    },
    "passage_q1_wrong": {
        "speaker": "粟柏年",
        "text": "“这笔墨是建墓的时候写的，不是后来加的。‘大翁’是当时对没有官职的老年男子的尊称。这是墓主的称号，不是工匠的名字。”",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [], "next": "passage_q1_correct"
    },
    "passage_q1_correct": {
        "speaker": "粟柏年",
        "text": "“元符二年，公元1099年。墓的年代定了。墓主姓赵，称大翁，没有官职。”",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [], "next": "passage_q2"
    },
    "passage_q2": {
        "speaker": "粟柏年",
        "text": "“赵大翁是谁？”",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [
            {"text": "墓主的名字就是赵大翁", "next": "passage_q2_wrong"},
            {"text": "赵大翁是墓主的尊称，真实姓名还不知道", "next": "passage_q2_correct"},
            {"text": "赵大翁可能是工匠的领班", "next": "passage_q2_wrong"}
        ], "next": None
    },
    "passage_q2_wrong": {
        "speaker": "粟柏年",
        "text": "“'大翁'是尊称，不是名字。他的真实姓名还需要其他证据。题记是锚点，不是答案——记住这句话。”",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [], "next": "passage_q2_correct"
    },
    "passage_q2_correct": {
        "speaker": "粟柏年",
        "text": "“对。‘大翁’是尊称。名字是什么、有没有别的称谓、他和墓里其他遗存是什么关系——这些都不能单凭题记定案。题记是锚点，不是答案。”",
        "background_image": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
        "choices": [], "next": "passage_window"
    },
    "passage_window": {
        "speaker": "陈怀远",
        "text": "陈怀远用手电照着西壁的破子棂窗，指尖虚虚地沿着窗格描了一遍。\n\n“九枚破子棂，斜向分开。《营造法式》里叫‘破子棂窗’，棂条断面是正方形旋转四十五度，像菱形。宋人做窗，不只为透光，也为看出去的时候，把外面的景切成碎片。”\n\n他收回手，“这窗是假的，外面没有景。但做法和真窗一样。”\n\n粟柏年：“题记、窗格、顶部——三件事同时出现在这个窄空间里。顶部沿中线收束，呈丁字形，轴线把视线带向后方。不能只读字，要读空间。”",
        "background_image": "assets/M1/09_过道/插图九 第一号墓过道两壁的破子棂窗.png",
        "choices": [{"text": "第一章：后室", "next": "rear_hall"}], "next": None
    },

    # ===== 后室 =====
    "rear_hall": {
        "speaker": "系统",
        "text": "穿过过道后，空间一下收住了。墙更近，光更窄，声音也像被砖面吞掉。\n\n后室平面六角形，比前室紧凑得多。手电光打在墙上，影子沿着砖缝折出六个面。",
        "background_image": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "rear_hall_fake_door"
    },
    "rear_hall_fake_door": {
        "speaker": "粟柏年",
        "text": "粟柏年的手电直接打向北壁。正中砌着假门，门额上雕砖作门簪四枚。版门两扇，左扇向北微启。砖雕少女立于门外，垂双髻，着窄袖衫和长裙，右手作启门状，脸微偏向门缝。\n\n“下葬的那天，有人站在这扇假门前，把门推开，又关上。最后留了一条缝。”\n\n妇人启门是宋代墓葬常见图像母题，表示门后还有庭院、厅堂，墓室至此未到尽头——图像空间延续，非物理通道。",
        "background_image": "assets/M1/10_后室_北壁/第一号墓后室北壁假门外的妇女雕像.png",
        "choices": [], "next": "rear_hall_bed"
    },
    "rear_hall_bed": {
        "speaker": "系统",
        "text": "粟柏年从假门前退开，手电光下落到北壁下部。一片低平的砖面铺展在地面上。\n\n“砖床。后室的基准。”\n\n苏池蹲在砖床边，解开皮尺的金属搭扣，把零刻度端抵在北壁根，尺身沿着砖床的中轴铺开。\n\n“你来拉这头。拉到南沿，别斜。基准要是歪了，人骨位置、铁钉分布都会跟着歪。”\n\n你跪下来拉住皮尺。金属头冰凉。\n\n“一百八十六厘米。”\n\n他在记录本上记了一笔。",
        "background_image": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
        "choices": [], "next": "rear_hall_bones"
    },
    "rear_hall_bones": {
        "speaker": "系统",
        "text": "手电光移到砖床偏北的位置。\n\n骨骼。两具。\n\n头骨并列安放，枕骨朝下，面朝西偏北。身体其余部分的骨骼混堆在头骨东侧，小骨片散乱重叠，像被时间打翻的一盒棋子。",
        "background_image": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "rear_hall_bones_detail"
    },
    "rear_hall_bones_detail": {
        "speaker": "苏池",
        "text": "“看盆骨。这具男，这具女。”他用镊子尖轻轻点了点，“牙齿磨耗。男的臼齿磨耗到牙本质了，四十五到五十五岁。女的磨耗浅一些，大概年轻十岁。”\n\n他摘掉手套，“判断方向：迁葬。先在别处下葬，后来把骨骸迁到这个墓里。”\n\n你在笔记上写下“迁葬？”，然后画了一个括号，里面写：“推测，待核。”\n\n粟柏年走过来看了你的笔记，在旁边的空白处写了两个字：“存疑。”\n\n“人骨是事实。人的故事还要慢慢分栏。”",
        "background_image": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "rear_hall_nails"
    },
    "rear_hall_nails": {
        "speaker": "系统",
        "text": "手电光从人骨位置向东移。\n\n砖床上有锈蚀铁钉和暗色痕迹，围出一片长约98厘米、宽约88厘米的不完全规整范围。铁钉排成两列，锈成了深褐色。苏池数了一遍。\n\n“十九枚。”\n\n他蹲下来，用游标卡尺量了量其中一枚铁钉的残长，又看了看钉头的锈蚀程度。\n\n“钉头截面不是方形，是梯形。棺材不是整板，是薄板拼的。下葬的时候，板子已经劈好了，钉子是现砸的。砸得急，有几枚歪了。”",
        "background_image": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "rear_hall_nails_question"
    },
    "rear_hall_nails_question": {
        "speaker": "粟柏年",
        "text": "【铁钉分布不规整，说明什么？】",
        "background_image": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [
            {"text": "可能有人动过棺材，或者棺材曾经移位", "next": "rear_hall_nails_a"},
            {"text": "铁钉只是固定葬具的，不规整可能是因为木材腐朽后铁钉松动了", "next": "rear_hall_nails_bc"},
            {"text": "不能确定，需要结合人骨位置、砖床范围和保存状态一起看", "next": "rear_hall_nails_bc"}
        ], "next": None
    },
    "rear_hall_nails_a": {
        "speaker": "粟柏年",
        "text": "“铁钉让人紧张，但它首先是葬具复原线索。十九枚铁钉围出的范围，能帮你想象棺材原本的大小和位置。至于有没有‘动过’——这是事件猜测。事件猜测需要事件证据。目前我们只有铁钉、人骨和朽木痕迹。这三样东西能证明的是葬具曾经存在，不能证明它被动过。”\n\n他在你的“事件猜测”旁边画了一道横线，写：“降级为葬具范围判断。”",
        "background_image": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "rear_hall_land_deed"
    },
    "rear_hall_nails_bc": {
        "speaker": "粟柏年",
        "text": "“对。铁钉首先是葬具复原线索。十九枚，围出约98厘米乘88厘米的范围。这能帮我们想象棺材的大小和位置。至于为什么分布不匀——木材腐朽、铁钉锈蚀、地层压力，都可能。不要把不规整直接解释为事件。”",
        "background_image": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
        "choices": [], "next": "rear_hall_land_deed"
    },
    "rear_hall_land_deed": {
        "speaker": "系统",
        "text": "手电光从砖床移向西壁下部。砖面上保留朱色文字，旁边配有券盖。地券为砖质朱书，十六行、倒写，券盖无字，并有“合同”背书。第一行可辨认：“大宋元符二年九月十□日赵……”\n\n粟柏年：“砖质朱书，十六行，倒写。券盖无字，背面有‘合同’二字背书。这是宋代买地券的标准形制。‘合同’是阴阳两界的契约凭证。”\n\n你凑近看。朱书字迹多漫漶，但“元符二年”四个字和过道题记对上了。\n\n（你）：“地券时间和题记一致。都是1099年。”\n\n粟柏年：“对。地券是建墓时埋的，题记也是建墓时写的。1099年是这座墓的时间锚点。但是——地券能告诉我们的是葬仪制度，不是人物命运。”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "rear_hall_images"
    },
    "rear_hall_images": {
        "speaker": "系统",
        "text": "手电光转向后室其他壁面。镜台、盆架、杌、高几、灯具、剪刀、熨斗散在几面墙上——后室多壁面可见生活化、寝居化器物图像。\n\n周淼：“这些图像让后室有生活感……但不能直接替人定身份。”\n\n粟柏年：“对。图像是图像，实物是实物。画在墙上的剪刀不能代替出土的剪刀，但图像能告诉我们：宋人希望死后继续过什么样的日子。”",
        "background_image": "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁壁画中的细腰剪刀、熨斗.png",
        "choices": [{"text": "第一章：暗格", "next": "hidden_compartment"}], "next": None
    },

    # ===== 暗格 =====
    "hidden_compartment": {
        "speaker": "系统",
        "text": "赵老倔在墓室西北角敲了敲地砖。指节扣在砖面上，声音沉而闷。扣到第四块，声音忽然变了，空，脆，像敲在一口枯井的井沿上。\n\n几块方砖被撬开以后，露出一口长方形小室。一尺见方，三寸深。里面放着一只铜筒，两端密封，蜡封完好。蜡面泛着暗黄的光泽。",
        "background_image": "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
        "choices": [], "next": "hidden_compartment_ritual"
    },
    "hidden_compartment_ritual": {
        "speaker": "赵老倔",
        "text": "“慢着。”\n\n赵老倔忽然伸手拦住正要开筒的粟柏年。他从腰间围裙的前兜里摸出三支旱烟卷，转身走到墓道口，用火镰打了好几下才点着，把烟卷插在封门砖缝里。青烟在晨光里直直地往上升。\n\n“这筒子封了九百年。开之前，让地下的魂知道有人来了。俺爷爷那辈儿传下来的规矩，进人家的门，先递根烟。”\n\n他退到一边，歪头看着铜筒。“行了。开吧。”",
        "background_image": "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
        "choices": [], "next": "hidden_compartment_open"
    },
    "hidden_compartment_open": {
        "speaker": "系统",
        "text": "陈怀远凑近铜筒看了看内壁，又用指甲轻轻刮了一点蜡封边缘的积垢，在指尖捻了捻。\n\n“蜡封是蜂蜡混了松香，九百年没透气。里面要是写了字，墨不会氧化得太厉害。这筒子做得讲究，比地券的券盖还严实。”\n\n粟柏年等那三支烟燃尽了，旋开筒盖。里面有两样东西：一卷绢帛，一方折叠整齐的素帛。素帛展开后约巴掌大小，上面用朱砂写着两行小字，字迹工整。\n\n第一行：治小，知见人。\n第二行：是征，书券人。\n\n两行字下面压着一枚朱砂指印。指纹的纹路和筒盖蜡封上那个隐约重合。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_fanqie_1"
    },
    "hidden_compartment_fanqie_1": {
        "speaker": "粟柏年",
        "text": "“这是反切注音法。取上一个字的声母，加下一个字的韵母和声调。”\n\n周淼凑过来看了一眼，手指在空中比划了一下。“治小……是赵吗？”\n\n【你觉得是什么？】",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [
            {"text": "赵", "next": "hidden_compartment_fq1_correct"},
            {"text": "晁", "next": "hidden_compartment_fq1_wrong"},
            {"text": "沼", "next": "hidden_compartment_fq1_wrong"}
        ], "next": None
    },
    "hidden_compartment_fq1_correct": {
        "speaker": "苏池",
        "text": "苏池推了推眼镜。“我也觉得是赵。颖东墓区的地券，知见人基本都是墓主同姓的族人。”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_fanqie_2"
    },
    "hidden_compartment_fq1_wrong": {
        "speaker": "粟柏年",
        "text": "粟柏年把素帛平铺在工作台上，眉头微微皱起。\n\n“这个切法用的是《广韵》音系。中古音和今天普通话之间差了一千多年的语音演变。治小切——‘治’属澄母仄声，清化后不送气，声母zh-；‘小’的韵母带-i-介音，在卷舌声母后脱落，变为-ǎo。zh- + -ào → zhào。”\n\n【知识卡片：反切注音法——宋代通行的反切依据《广韵》音系。中古全浊声母在现代普通话中全部清化：平声送气、仄声不送气。介音在卷舌声母后脱落。全浊上声字变为去声。“赵”中古音为上声（全浊声母），今音变去声zhào。】",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_fq1_correct"
    },
    "hidden_compartment_fanqie_2": {
        "speaker": "陈怀远",
        "text": "陈怀远从画板后面抬起头，老花镜挂在胸口。\n\n“是征切，书券人。这个切法拼出来是什么？”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [
            {"text": "生", "next": "hidden_compartment_fq2_wrong"},
            {"text": "诚", "next": "hidden_compartment_fq2_correct"},
            {"text": "称", "next": "hidden_compartment_fq2_wrong"}
        ], "next": None
    },
    "hidden_compartment_fq2_wrong": {
        "speaker": "周淼",
        "text": "周淼轻轻摇头，指了指绢帛。“那份绢帛的开头第一行写的是什么？”\n\n你低头看向绢帛。第一行字清晰可辨：“怀诚谨记”。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_fq2_correct"
    },
    "hidden_compartment_fq2_correct": {
        "speaker": "粟柏年",
        "text": "“是征切拼出的是‘诚’。上字‘是’属禅母仄声，清化后读不送气sh-。下字‘征’韵母为-ēng。切出的读音shēng，对应到‘诚’这个字上。”\n\n他把素帛重新叠好，放在绢帛旁边。\n\n“见证人，赵。书券人，诚。正文第一字，怀。合在一起——赵怀诚。他把全名拆成三份，藏在这只铜筒里。”\n\n周淼：“自己给自己的地券当知见人，又当书券人。一个人签了三个名字。”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk"
    },
    "hidden_compartment_silk": {
        "speaker": "系统",
        "text": "粟柏年：“看看绢帛。”\n\n你接过绢帛。侧光下，墨迹清晰工整，但下端有几块区域被水渍浸染过。水渍边缘泛着淡淡的黄。\n\n你读出了第一段。\n\n“怀诚谨记：余十六起家，三十成业，半生积蓄，尽在粮廪之间。平生所为，无不可对人言者。惟崇宁四年一事，耿耿于怀，夜不能寐。”\n\n“是岁秋，大水，颖河堤溃，三县漂没。朝廷赈粮不足，饥民鬻儿卖女。余心急如焚，闻知州李公讳明辅困于粮台，乃夜叩州府之门。”\n\n“李公曰：府库之粮，皆在簿册——”\n\n最后一个字残缺。水渍刚好浸掉了最关键的那个字。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_1_q"
    },
    "hidden_compartment_silk_1_q": {
        "speaker": "系统",
        "text": "【你辨认再三，只剩下半个字。是什么字？】",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [
            {"text": "“刀”字旁，推测是“斩”", "next": "hidden_compartment_silk_1_correct"},
            {"text": "“首”字旁，推测是“道”", "next": "hidden_compartment_silk_1_wrong"},
            {"text": "字迹完全无法辨认", "next": "hidden_compartment_silk_1_wrong2"}
        ], "next": None
    },
    "hidden_compartment_silk_1_wrong": {
        "speaker": "粟柏年",
        "text": "粟柏年凑过来，把手电换到侧面。“你再看看左下角——有没有一个往上勾的笔锋？”\n\n你凑近再看。水渍下隐约有竖笔带钩的痕迹。\n\n“……是刀字旁。”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_1_correct"
    },
    "hidden_compartment_silk_1_wrong2": {
        "speaker": "粟柏年",
        "text": "粟柏年没有催你。他把手电换到侧面，光极斜地掠过绢面。水渍下的墨痕显出微弱的光泽差异。\n\n“你看看左下角。那个笔画，末端是不是往左上方勾了一下？”\n\n你凑近看。一个竖笔，末端向左上勾起。是“刀”字旁。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_1_correct"
    },
    "hidden_compartment_silk_1_correct": {
        "speaker": "系统",
        "text": "你写下：府库之粮，皆在簿册，私动一粒即斩。\n\n绢帛继续往下。赵怀诚说，若李公不知，便是小人自取，三千石算在小人头上。李公沉吟良久，终曰……\n\n此处又一处水渍，模糊了后半句。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_2_q"
    },
    "hidden_compartment_silk_2_q": {
        "speaker": "系统",
        "text": "【辨认水渍下的字。是什么偏旁？】",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [
            {"text": "“酉”字旁，与“酒”有关", "next": "hidden_compartment_silk_2_correct"},
            {"text": "字迹太模糊，无法判断", "next": "hidden_compartment_silk_2_wrong"},
            {"text": "“日”字旁，推测是“晚”", "next": "hidden_compartment_silk_2_wrong2"}
        ], "next": None
    },
    "hidden_compartment_silk_2_wrong": {
        "speaker": "粟柏年",
        "text": "粟柏年没有催你，把手电换到侧面。\n\n“后面三个字是‘不省人事’。你再看看这个水渍下的偏旁——中间这三横，下面这一横是不是略微弯曲？”\n\n你凑近看。一个“酉”字旁。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_2_correct"
    },
    "hidden_compartment_silk_2_wrong2": {
        "speaker": "粟柏年",
        "text": "粟柏年把手电换到侧面。\n\n“你仔细看看这个偏旁，中间这三横，下面这一横是不是略微弯曲？日字旁的中间横笔是平直的。后面三个字是‘不省人事’。一个人‘不省人事’的前提是什么？喝醉了。”\n\n你凑近看。一个“酉”字旁。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_2_correct"
    },
    "hidden_compartment_silk_2_correct": {
        "speaker": "系统",
        "text": "你写下：本官今夜酒醉，不省人事。\n\n之后他以李公手谕开了府库，调三千石粮，又用自家粮米抵还。此事只他与李公二人知情，迄今二十载。李公已故，他亦老矣。",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_3_q"
    },
    "hidden_compartment_silk_3_q": {
        "speaker": "系统",
        "text": "最后一处残损。你把绢帛拿到灯下，侧光极斜地照过去。几个字的结体从水渍里浮出来。第一个字，笔画中有“矢”部。\n\n【“矢”部开头，接下去最可能是哪个字？】",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [
            {"text": "知——知我罪我", "next": "hidden_compartment_silk_3_correct"},
            {"text": "矩——规矩所在", "next": "hidden_compartment_silk_3_wrong"},
            {"text": "短——短语几句", "next": "hidden_compartment_silk_3_wrong"}
        ], "next": None
    },
    "hidden_compartment_silk_3_wrong": {
        "speaker": "粟柏年",
        "text": "“你再读一遍绢帛最后一句话。‘留待后人评说。余不敢自居善人，亦不忍见死不救。_____，惟待后人。’这四句的节奏是两个字一顿——不敢、不忍，接下来也应该是两个字的词。”\n\n周淼忽然开口，声音很轻：“‘知我罪我，惟待后人’——是《左传》里的句子。我父亲以前拓过一方墓志，上面也有这四个字。不管后人怎么评价我，我都认了。”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_silk_3_correct"
    },
    "hidden_compartment_silk_3_correct": {
        "speaker": "系统",
        "text": "你写下最后一行：知我罪我，惟待后人。崇宁五年腊月。赵怀诚泣血谨记。\n\n绢帛摊在你面前。周淼把素帛轻轻挪了个位置，让它和绢帛并排放在一起。她盯着绢帛下端那几块水渍看了很久，忽然低声说：“这些字被水泡过……写的时候是不是在哭。”",
        "background_image": "assets/M1/16_出土器物与人骨/地券.png",
        "choices": [], "next": "hidden_compartment_after"
    },
    "hidden_compartment_after": {
        "speaker": "粟柏年",
        "text": "粟柏年把铜筒盖好，素帛叠好，压在绢帛上面。他把铜筒放回暗格里，站起来看了你一眼。\n\n“屏风藏字藏在山水皴法里。绢帛塞在暗格铜筒里。素帛反切是最难解的，放在最上面。他设了三道门。你推开了。”\n\n他把手电关掉。墓室里暗了一瞬，然后甬道口的日光重新涌进来。\n\n“先休息。但有一件事你要记住——赵怀诚的自述可以动人，但不能替证据发言。报告里，绢帛和反切要单独分栏。”",
        "background_image": "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
        "choices": [{"text": "终章：三栏报告", "next": "final_report"}], "next": None
    },

    # ===== 终章 =====
    "final_report": {
        "speaker": "系统",
        "text": "一号墓的全部测绘和记录工作接近尾声。\n\n但你还有一件事没做完。\n\n粟柏年在帆布棚下铺开一张大白纸，六个方框从左到右排开，像一条被拉直的墓道轴线。\n\n他递给你一叠剪好的小纸条和三支不同颜色的铅笔。\n\n“现在，把你这一路记下的所有线索，按三种颜色分类。红——可判断。蓝——可推测。黑——仍存疑。”",
        "background_image": "assets/M1/17_补充总览图/P0-1_甬道总交互图.png",
        "choices": [], "next": "final_report_red"
    },
    "final_report_red": {
        "speaker": "系统",
        "text": "【第一栏：可判断——你拿起红色的铅笔。】\n\n以下哪些线索应放入“可判断”栏？（多选）",
        "background_image": "assets/M1/17_补充总览图/P0-1_甬道总交互图.png",
        "choices": [
            {"text": "A. M1空间序列：墓道→墓门→甬道→前室→过道→后室", "next": "final_report_red_check"},
            {"text": "B. 封门砖组织：外层横砖加菱角牙子，中层横砖，内层卧丁砖", "next": "final_report_red_check"},
            {"text": "C. 过道题记：“元符二年赵大翁布”，1099年", "next": "final_report_red_check"},
            {"text": "D. 后室二具人骨，头骨并列，其余骨骼混堆", "next": "final_report_red_check"},
            {"text": "E. 十九枚铁钉及葬具范围（约98cm×88cm）", "next": "final_report_red_check"},
            {"text": "F. 地券形制：砖质朱书，十六行，倒写，合同背书", "next": "final_report_red_check"},
            {"text": "G. 妇人启门与假门：图像空间延续母题，非物理通道", "next": "final_report_red_check"},
            {"text": "H. 赵怀诚绢帛自述：崇宁四年调粮三千石", "next": "final_report_red_h"}
        ], "next": None
    },
    "final_report_red_h": {
        "speaker": "粟柏年",
        "text": "“绢帛自述是F线索。它很动人，但报告不能凭‘动人’进可判断栏。放回蓝或黑。”",
        "background_image": "assets/M1/17_补充总览图/P0-1_甬道总交互图.png",
        "choices": [], "next": "final_report_red_check"
    },
    "final_report_red_check": {
        "speaker": "系统",
        "text": "你逐一贴好红色标签：\n\nENV-P0-01：M1空间序列\nGATE-P0-01~03：墓门门额、背面彩画、封门砖组织\nCOR-P0-01~03：甬道顶部叠胜、东壁司阍、西壁司阍马与捧酒者\nFRONT-P0-01~04：前室东壁女乐、西壁对坐、南壁侍卫、顶部铺作\nPASS-P0-01~03：过道题记（1099年）、破子棂窗、丁字盝顶宝盖\nHS-P0-01~05：后室砖床、人骨、铁钉、地券、妇人启门与假门\n\n粟柏年看了一遍，在红标签旁边用钢笔补了一行字：“材料显示……”“可记录为……”“可作为……证据”。\n\n“可判断栏的每一句话，都要能用‘材料显示’开头。不能的，换颜色。”",
        "background_image": "assets/M1/17_补充总览图/P0-1_甬道总交互图.png",
        "choices": [], "next": "final_report_blue"
    },
    "final_report_blue": {
        "speaker": "系统",
        "text": "【第二栏：可推测——你拿起蓝色的铅笔。】\n\n以下哪些线索应放入“可推测”栏？（多选）",
        "background_image": "assets/M1/17_补充总览图/P0-2_前室入口总览图.png",
        "choices": [
            {"text": "A. 赵大翁与赵怀诚可能是同一人", "next": "final_report_blue_check"},
            {"text": "B. 反切素帛拼出的“赵怀诚”是墓主的真实姓名", "next": "final_report_blue_check"},
            {"text": "C. 1099年建墓，1106年写绢帛，可能意味着阶段性安葬或迁葬", "next": "final_report_blue_check"},
            {"text": "D. 银扣与外祖父的关联暗示林砚秋的个人动机", "next": "final_report_blue_check"},
            {"text": "E. “永安”刻字的含义", "next": "final_report_blue_e"},
            {"text": "F. 后室二具人骨为迁葬遗存", "next": "final_report_blue_check"}
        ], "next": None
    },
    "final_report_blue_e": {
        "speaker": "粟柏年",
        "text": "“‘永安’目前没有任何后续线索支撑。它连‘推测’的边都够不上，只能留在‘仍存疑’。”",
        "background_image": "assets/M1/17_补充总览图/P0-2_前室入口总览图.png",
        "choices": [], "next": "final_report_blue_check"
    },
    "final_report_blue_check": {
        "speaker": "系统",
        "text": "你贴上蓝色标签：\n\nPASS-F-01：赵大翁与赵怀诚可能有关\nHS-F-02：反切素帛拼出“赵怀诚”\nHS-F-03：赵怀诚绢帛自述\nHS-F-04：1099/1106时间差的剧情解释\nENV-F-01：银扣与个人动机\nHS-P0-02延伸：人骨位置支持迁葬推测\n\n粟柏年看了一遍，在蓝标签旁边写：“剧情中可推测……”“自述线提示……”“但不能作为学术定论”。\n\n“推测栏要有‘但’。没有‘但’，推测就会变成判断。”",
        "background_image": "assets/M1/17_补充总览图/P0-2_前室入口总览图.png",
        "choices": [], "next": "final_report_black"
    },
    "final_report_black": {
        "speaker": "系统",
        "text": "【第三栏：仍存疑——你拿起黑色的铅笔。】\n\n以下哪些线索应放入“仍存疑”栏？（多选）",
        "background_image": "assets/M1/17_补充总览图/P0-3_过道轴线总览图.png",
        "choices": [
            {"text": "A. “永安”刻字的材料来源和真实含义", "next": "final_report_black_check"},
            {"text": "B. 屏风隐字是否真实可读", "next": "final_report_black_check"},
            {"text": "C. 暗格是否具备考古材料支撑", "next": "final_report_black_check"},
            {"text": "D. 迁葬的具体原因和初葬对象", "next": "final_report_black_check"},
            {"text": "E. 二具人骨的具体身份、死因和亲属关系", "next": "final_report_black_check"},
            {"text": "F. 1106年的来源与可靠性", "next": "final_report_black_check"},
            {"text": "G. 银扣与M1的学术关系", "next": "final_report_black_check"}
        ], "next": None
    },
    "final_report_black_check": {
        "speaker": "系统",
        "text": "你贴上黑色标签：\n\nGATE-F-01：“永安”——材料不足，需待核\nFRONT-F-01：屏风隐字——仍存疑/待核\nHS-F-01：暗格——剧情待核；无考古材料支撑\nHS-P0-02延伸：迁葬原因、初葬对象、死因——不能据此判断\nHS-F-04：1106来源——需按剧情/待核处理\nENV-F-01延伸：银扣与M1关系——仍存疑\n\n粟柏年看了一遍，在黑标签旁边写：“材料不足……”“需待核……”“不能据此判断……”\n\n“存疑不是失败。存疑是诚实。”",
        "background_image": "assets/M1/17_补充总览图/P0-3_过道轴线总览图.png",
        "choices": [], "next": "final_report_summary"
    },
    "final_report_summary": {
        "speaker": "粟柏年",
        "text": "粟柏年把三栏纸条压平，抬头看着你。\n\n“现在，回答我一个问题。赵怀诚线是不是最终真相？”",
        "background_image": "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
        "choices": [
            {"text": "是。所有线索都指向赵怀诚", "next": "final_report_summary_wrong"},
            {"text": "不是。赵怀诚线只是剧情推测，不能覆盖学术证据", "next": "final_report_summary_correct"},
            {"text": "部分是。解释了人物动机，但不能解释所有考古发现", "next": "final_report_summary_correct"}
        ], "next": None
    },
    "final_report_summary_wrong": {
        "speaker": "粟柏年",
        "text": "“你把F线索串成了一个完整故事，但故事不是证据。赵怀诚线可以被情感回收，不能反向改写P0结论。题记、地券、人骨、铁钉——这些才是可判断的。绢帛、反切、暗格——在蓝栏和黑栏里。”\n\n他把红色标签往中间推了推，蓝色和黑色标签留在两侧。\n\n“重来。”",
        "background_image": "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
        "choices": [{"text": "重新选择", "next": "final_report_summary"}], "next": None
    },
    "final_report_summary_correct": {
        "speaker": "粟柏年",
        "text": "“对。赵怀诚线可以被情感回收，但不能反向改写P0结论。主线不是‘找到赵怀诚就真相大白’，而是‘学会把赵怀诚线放进可推测栏，把题记、地券、人骨和铁钉放进可判断栏，把永安、屏风隐字、暗格和时间差中缺少材料支撑的部分放进仍存疑栏’。”\n\n他站起来，把三栏报告折好，放进一个牛皮纸档案袋里。\n\n“这份报告，红栏是骨架，蓝栏是血肉，黑栏是留白。没有留白的画，不是好画。”",
        "background_image": "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
        "choices": [{"text": "封存", "next": "ending"}], "next": None
    },

    # ===== 封存 =====
    "ending": {
        "speaker": "系统",
        "text": "清理收尾。第二层砖床下出了一枚铜钱，面铸篆书“绍圣元宝”，压在砖床正中一个小方孔上方——那是宋代风水书里叫“金井”的位置。粟柏年看了一眼说是镇墓钱。\n\n前室西南隅出了两块陶瓮残片。砖床上还有一堆锈碎的残铁器和两块长方形铁块，粟柏年判断是镇压用的生铁。两件白瓷碗，灰胎，白釉，撇口，圈足。\n\n赵老倔把瓷片一片一片捡进竹筐里，嘴里嘟囔：“这么有钱的人，陪葬就这么点东西？”",
        "background_image": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
        "choices": [], "next": "ending_question"
    },
    "ending_question": {
        "speaker": "系统",
        "text": "【你怎么回答赵老倔？】",
        "background_image": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
        "choices": [
            {"text": "“宋人烧纸明器，纸扎代替实物，坟前烧掉”", "next": "ending_song_wrong"},
            {"text": "“画在壁画上的东西，就已经是陪葬了”", "next": "ending_song_wrong"},
            {"text": "“可能最值钱的东西已经被盗走了”", "next": "ending_song_wrong2"}
        ], "next": None
    },
    "ending_song_wrong2": {
        "speaker": "粟柏年",
        "text": "粟柏年合上记录本。“这个墓没有被盗过的痕迹。封门砖完整，地券还在原位，铜筒的蜡封完好。”",
        "background_image": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
        "choices": [], "next": "ending_song_wrong"
    },
    "ending_song_wrong": {
        "speaker": "粟柏年",
        "text": "“对。宋人烧纸明器，用纸扎的东西代替实物，在坟前烧掉。墓室里画满壁画，画上的金银铤、钱贯、家具、仆役就是陪葬。实物不需要放太多。”",
        "background_image": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
        "choices": [], "next": "ending_final"
    },
    "ending_final": {
        "speaker": "系统",
        "text": "一号墓全部测绘和记录工作于12月31日中午完成。陈怀远把最后一张测绘图从坐标纸上揭下来，对着光看了一遍，点了点头，卷好放进图筒。周淼在东壁前站了最后一次，把吹排箫乐伎的衣纹线条又勾了一遍，然后合上速写簿，对着壁画轻轻点了一下头。赵老倔把撬棍和铁锹收好，蹲在墓道口抽了最后一支烟。苏池最后一个从后室出来，手里端着木盘，盘里的骨样标本一块一块摆得整整齐齐。\n\n粟柏年在下午宣布，明天调人手去西北方向——12月21日，民工已经在二十米外发现了第二处砖顶。\n\n收工前，你最后一次走进后室。手电光照在北壁假门上。那个砖雕少女，垂双髻，右手作启门状。门微启，左扇永远停在推开的角度上。她在黑暗里站了八百多年。\n\n你关掉手电，在黑暗中站了一会儿，转身出来。\n\n粟柏年在墓门外等你。陈怀远站在他旁边。周淼抱着速写簿，围巾被风吹得翻起来。苏池端着木盘走过来。赵老倔已经在坡下喊吃饭了。\n\n粟柏年把木门合上，亲手上了锁。\n\n“第一号墓发掘工作至此全部结束。”\n\n他翻开记录本，在当天日志末尾写了一行字。写完之后拧上钢笔帽，抬头看了你一眼。\n\n“明天。二号墓。”",
        "background_image": "assets/M1/02墓道与墓门/第一号墓外围.png",
        "choices": [{"text": "完", "next": "game_end"}], "next": None
    },
    "game_end": {
        "speaker": "系统",
        "text": "——全剧终——",
        "background_image": "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
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

ASSETS_DIR = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets'))

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory(ASSETS_DIR, filename)

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

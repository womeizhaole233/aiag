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

# ==================== 章节配置 ====================
CHAPTERS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'chapters.json')

def load_chapters():
    """返回章节配置列表"""
    if os.path.exists(CHAPTERS_FILE):
        try:
            with open(CHAPTERS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f) or {}
            return data.get('chapters', [])
        except Exception:
            pass
    return []

def save_chapters(chapters):
    """保存章节配置"""
    with open(CHAPTERS_FILE, 'w', encoding='utf-8') as f:
        json.dump({'chapters': chapters}, f, ensure_ascii=False, indent=2)

def get_chapter_for_node(node_id):
    """根据节点ID查找所属章节"""
    chapters = load_chapters()
    for ch in chapters:
        if ch.get('start_node', '') <= node_id <= ch.get('end_node', ''):
            return ch.get('id')
    return None

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
    for g in groups:
        groups[g].sort()
    # portraits/ 子目录置顶
    def _sort_key(item):
        g = item[0]
        return (0 if g.startswith('portraits') else 1, g)
    return dict(sorted(groups.items(), key=_sort_key))

# ==================== 对话数据 ====================
# 由 convert_md.py 从 text new.md 自动生成
DIALOGUES = {

    # ===== n00001 =====
    "n00001": {
        "speaker": '白沙手记',
        "text": """这是你第一次见到白沙。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00002',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00002 =====
    "n00002": {
        "speaker": '白沙手记',
        "text": """你坐了六个小时的卡车，又在驴车上颠了两个钟头，才在一片铅灰色的冬日天空下，望见了几棵老槐树掩映的土房。
河南，禹县，白沙镇。一个在地图上几乎找不到名字的地方，可你的外祖父来过。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00003',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00003 =====
    "n00003": {
        "speaker": '白沙手记',
        "text": """后来他再也没有提起过这里。只留下几张发黄的调查记录、一枚断开的银扣，以及一句谁也听不懂的话——“地下的东西，有时候比活人记性更好”。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00004',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00004 =====
    "n00004": {
        "speaker": '白沙手记',
        "text": """十二月的华北平原，风裹着干燥的尘土扑面而来。
你紧了紧灰蓝列宁装的领口，手指碰到一根细细的皮绳。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00005',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00005 =====
    "n00005": {
        "speaker": '白沙手记',
        "text": """皮绳上系着一枚银怀表链扣，圆形，比铜钱略大，银质表面布满细密裂纹。
那是外祖父的遗物，从你记事起就挂在颈间，没摘下来过一天。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00006',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00006 =====
    "n00006": {
        "speaker": '白沙手记',
        "text": """小时候，你不止一次问过母亲，为什么外祖父把这样一枚旧银扣看得那么重。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00007',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00007 =====
    "n00007": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '母亲说那只是怀表链扣', "next": 'n00008' },
            {"text": '母亲说那是外祖父最珍惜的东西', "next": 'n00009' },
            {"text": '母亲不愿提起', "next": 'n00010' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00008 =====
    "n00008": {
        "speaker": '白沙手记',
        "text": """母亲笑着说：“旧东西罢了。”可她说这句话的时候，并没有看你的眼睛。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00011',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00009 =====
    "n00009": {
        "speaker": '白沙手记',
        "text": """母亲沉默了很久。最后只说：“有些东西对别人不值钱，对他却很重要。”""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00011',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00010 =====
    "n00010": {
        "speaker": '白沙手记',
        "text": """母亲收起银扣，很久都没有说话，从那以后，你再也没问过。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00011',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00011 =====
    "n00011": {
        "speaker": '白沙手记',
        "text": """无论是哪一种回答，你都始终不知道，外祖父为什么一直留着它。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00012',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00012 =====
    "n00012": {
        "speaker": '？？？',
        "text": """林同志！""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00013',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00013 =====
    "n00013": {
        "speaker": '白沙手记',
        "text": """你回过神来。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00014',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00014 =====
    "n00014": {
        "speaker": '白沙手记',
        "text": """一个扎两根麻花辫的姑娘朝你快步走来，圆脸上有浅浅的雀斑，杏仁眼很灵动，眼尾略微下垂。
她穿一件藏蓝色列宁装女式改良版，收腰设计，领口别着一枚小小的梅花胸针。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00015',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00015 =====
    "n00015": {
        "speaker": '白沙手记',
        "text": """她接过你手里的帆布包，笑着说：""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00016',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00016 =====
    "n00016": {
        "speaker": '周淼',
        "text": """我是周淼，负责壁画与纹饰测绘。粟老师在镇上供销社给你留了饭，让你今晚好好歇着，明天——""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00017',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00017 =====
    "n00017": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '明天什么时候开工？', "next": 'n00018' },
        ],
        "next": 'n00018',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00018 =====
    "n00018": {
        "speaker": '白沙手记',
        "text": """她歪着头，想了一下，略带疑惑的说：""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00019',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00019 =====
    "n00019": {
        "speaker": '周淼',
        "text": """五点半。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00020',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00020 =====
    "n00020": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '五点半有什么问题吗？', "next": 'n00021' },
            {"text": '点点头，不说话', "next": 'n00022' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00021 =====
    "n00021": {
        "speaker": '周淼',
        "text": """只是有点好奇，粟老师每天五点半到现场，我们六点。你是第一个被要求五点半到的人。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00023',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00022 =====
    "n00022": {
        "speaker": '白沙手记',
        "text": """周淼也笑了笑，但那笑容里带着一点好奇。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00023',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00023 =====
    "n00023": {
        "speaker": '白沙手记',
        "text": """她转身给你带路，你注意到她的裤腿用皮筋扎紧，脚上一双黑色圆头布鞋，鞋面沾着洗不掉的红褐色铁锈痕。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00024',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00024 =====
    "n00024": {
        "speaker": '白沙手记',
        "text": """你们穿过村子，爬上一道缓坡。坡顶上，那片隆起的高地出现在暮色里。
一个瘦高的身影蹲在土台边上，手电光在暮色中晃动。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00025',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00025 =====
    "n00025": {
        "speaker": '白沙手记',
        "text": """他穿了一身洗得发白的深灰色列宁装，背对着你，用放大镜一寸一寸地看着什么。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00026',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00026 =====
    "n00026": {
        "speaker": '周淼',
        "text": """粟老师，林助教到了。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00027',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00027 =====
    "n00027": {
        "speaker": '白沙手记',
        "text": """你们靠近的时候，那人始终没有回头，手电光在地面缓慢移动，像是在寻找什么。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00028',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00028 =====
    "n00028": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '他在看土层', "next": 'n00029' },
            {"text": '他在看植物', "next": 'n00030' },
            {"text": '他在找东西', "next": 'n00031' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00029 =====
    "n00029": {
        "speaker": '白沙手记',
        "text": """手电停留的位置，恰好是一道颜色略深的土层分界。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00032',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00030 =====
    "n00030": {
        "speaker": '白沙手记',
        "text": """附近几乎没有植物，只有冬天枯死的杂草。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00032',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00031 =====
    "n00031": {
        "speaker": '白沙手记',
        "text": """你看不出来，但他的动作不像是在寻找遗失物。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00032',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00032 =====
    "n00032": {
        "speaker": '白沙手记',
        "text": """就在这时，那人开口了。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00033',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00033 =====
    "n00033": {
        "speaker": '粟柏年',
        "text": """路上看见那条干河道了吗？""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00034',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00034 =====
    "n00034": {
        "speaker": '白沙手记',
        "text": """粟柏年朝你的方向推了推鼻梁上的黑框圆眼镜。他脸略长，颧骨略高，皮肤偏黑，眼窝微凹，嘴角自然下垂，语气平和。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00035',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00035 =====
    "n00035": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '看见了。', "next": 'n00036' },
        ],
        "next": 'n00036',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00036 =====
    "n00036": {
        "speaker": '粟柏年',
        "text": """什么走向？""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00037',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00037 =====
    "n00037": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '东北—西南', "next": 'n00038' },
            {"text": '西北—东南', "next": None },
            {"text": '东南—西北', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00038 =====
    "n00038": {
        "speaker": '白沙手记',
        "text": """粟柏年微不可见地皱了下眉头。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00039',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00039 =====
    "n00039": {
        "speaker": '粟柏年',
        "text": """地形勘测在考古过程中也是很重要的一步。那条干河道是西北到东南走向。下次路过的时候，多看一眼。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00040 =====
    "n00040": {
        "speaker": '粟柏年',
        "text": """嗯。观察得很仔细。明天早上五点半，在这个位置，先看墓道。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00041',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00041 =====
    "n00041": {
        "speaker": '白沙手记',
        "text": """他站起来，身体重心微微前移，像随时准备往前走、往下看。深灰色列宁装的领口磨得起了毛边，袖口打着细致的手缝补丁。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00042',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00042 =====
    "n00042": {
        "speaker": '白沙手记',
        "text": """粟柏年，29岁，北大考古专业青年教师，也是你接下来的领队老师。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00043',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00043 =====
    "n00043": {
        "speaker": '白沙手记',
        "text": """他领着你往工地里面走了一段。
探方边上支着几盏马灯，一个中年人正坐在帆布棚下伏案绘图，国字脸，花白的头发浓密。
外罩一件军绿色帆布工装马甲，上面插满了比例尺、铅笔和手电筒。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00044',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00044 =====
    "n00044": {
        "speaker": '粟柏年',
        "text": """陈怀远，陈工。负责建筑结构测绘。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00045',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00045 =====
    "n00045": {
        "speaker": '白沙手记',
        "text": """陈怀远从老花镜上方看了你一眼，温和地对你笑了笑，又继续画图。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00046',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00046 =====
    "n00046": {
        "speaker": '白沙手记',
        "text": """棚子另一角蹲着个壮实的村民，宽肩膀，罗圈腿，一身黑色粗布对襟短褂敞着扣子。
头上系着一条白毛巾，额头三道很深的抬头纹。他正用磨刀石磨着铁锹刃。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00047',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00047 =====
    "n00047": {
        "speaker": '粟柏年',
        "text": """赵广田师傅，负责发掘。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00048',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00048 =====
    "n00048": {
        "speaker": '赵广田',
        "text": """叫我赵老倔就成。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00049',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00049 =====
    "n00049": {
        "speaker": '白沙手记',
        "text": """赵老倔眯着眼看了你一眼，把你从头到脚打量了一遍，然后“哼”了一声。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00050',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00050 =====
    "n00050": {
        "speaker": '赵老倔',
        "text": """又是个读书的。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00051',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00051 =====
    "n00051": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '“读书不好吗？”', "next": 'n00052' },
            {"text": '“赵师傅以前见过很多学生？”', "next": 'n00053' },
            {"text": '不接话', "next": 'n00054' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00052 =====
    "n00052": {
        "speaker": '赵老倔',
        "text": """“没说不好。就是多数待不长。”""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00055',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00053 =====
    "n00053": {
        "speaker": '赵老倔',
        "text": """“见过。”有些人鞋还没沾泥，就想写报告。”""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00055',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00054 =====
    "n00054": {
        "speaker": '白沙手记',
        "text": """赵老倔看了你一眼，继续磨铁锹，像是在等以后再下判断。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00055',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00055 =====
    "n00055": {
        "speaker": '白沙手记',
        "text": """棚子最里面亮着一盏小灯，一个戴圆框眼镜的年轻人正伏在矮桌边。圆脸，皮肤很白，手指细长。
桌上摊着几块用纱布包好的骨骼标本。他正用游标卡尺量一块髋骨碎片。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00056',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00056 =====
    "n00056": {
        "speaker": '粟柏年',
        "text": """苏池，体质人类学专业的。他负责骨骼鉴定。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00057',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00057 =====
    "n00057": {
        "speaker": '苏池',
        "text": """你好。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00058',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00058 =====
    "n00058": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [
            {"text": '你好。', "next": 'n00059' },
        ],
        "next": 'n00059',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00059 =====
    "n00059": {
        "speaker": '粟柏年',
        "text": """大家今天先休息吧，明天会很累。""",
        "background_image": 'assets/M1/01环境地图/白沙宋墓地形图.png',
        "choices": [],
        "next": 'n00060',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00060 =====
    "n00060": {
        "speaker": '白沙手记',
        "text": """天还没亮透，风从华北平原的枯槁田野上刮过来，像一把钝锯子在骨头缝里来回拉。
你跟着粟柏年爬上缓坡，工地在晨色里显出轮廓：几片探方，几盏马灯，帆布棚子被风吹得哗哗响。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00061',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00061 =====
    "n00061": {
        "speaker": '白沙手记',
        "text": """粟柏年停在高地边缘，从口袋里掏出一张折叠整齐的坐标纸，在晨雾里抖开。
纸上是白沙宋墓群的平面草图，M1在最南端，靠近水库取土区的边缘。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00062',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00062 =====
    "n00062": {
        "speaker": '粟柏年',
        "text": """先看大局。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00063',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00063 =====
    "n00063": {
        "speaker": '白沙手记',
        "text": """他把草图摊在一块平整的夯土断面上，用两块碎砖压住边角。
图纸右上角印着一行小字：“白沙附近图”，标出了白沙镇、禹县、颖水的相对位置，水库工程取土区用斜线阴影标出，M1就在那片阴影的边缘。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00064',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00064 =====
    "n00064": {
        "speaker": '粟柏年',
        "text": """白沙镇在这个位置。墓群坐落在这道南北向土岗的东坡，海拔比周围农田高出约十五米。
东南高，西北低。土岗北侧那条干涸的河道——西北到东南走向。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00065',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00065 =====
    "n00065": {
        "speaker": '白沙手记',
        "text": """你凑过去。图纸上画着一道蜿蜒的虚线，从镇子边缘延伸过来，绕过一片洼地，攀上土岗。虚线旁边标了一行小字：“1940年勘测路线”。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00066',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00066 =====
    "n00066": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [
            {"text": '这是……？', "next": 'n00067' },
        ],
        "next": 'n00067',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00067 =====
    "n00067": {
        "speaker": '粟柏年',
        "text": """1940年，你外祖父随历史所调查组来过白沙。这条线是他手绘的。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00068',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00068 =====
    "n00068": {
        "speaker": '白沙手记',
        "text": """你的手指碰到领口里的银扣，隐隐感觉有些发烫。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00069',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00069 =====
    "n00069": {
        "speaker": '粟柏年',
        "text": """待会儿你要进的是一座完整的墓，是一个从外到内的空间系统。
每走一步，前面的发现都会重新被后面的证据检验。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00070',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00070 =====
    "n00070": {
        "speaker": '白沙手记',
        "text": """他把草图折好，塞回口袋，抬头看了你一眼。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00071',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00071 =====
    "n00071": {
        "speaker": '粟柏年',
        "text": """现在，把白沙位置、墓群范围和这条空间序列标在你的记录本上。顺序别乱。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00072',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00072 =====
    "n00072": {
        "speaker": '白沙手记',
        "text": """你在笔记上画下三个框：位置图、范围图、序列轴。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00073',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00073 =====
    "n00073": {
        "speaker": '白沙手记',
        "text": """赵老倔扛着铁锹走上来，走到坡顶忽然停下脚步，用锹柄敲了敲脚下的地面，又侧耳听了听。
他蹲下去，抓起一把土在掌心搓了搓。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00074',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00074 =====
    "n00074": {
        "speaker": '赵老倔',
        "text": """这一片夯过。土色发黏，有石灰。下面三尺，应该是墓道的填土。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00075',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00075 =====
    "n00075": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [
            {"text": '”只靠踩就能知道？“', "next": 'n00076' },
            {"text": '”为什么不是自然土？“', "next": 'n00077' },
            {"text": '蹲下来观察土色', "next": 'n00078' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00076 =====
    "n00076": {
        "speaker": '赵老倔',
        "text": """踩得多了就知道。跟认路一样。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00079',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00077 =====
    "n00077": {
        "speaker": '赵老倔',
        "text": """自然土没这么实，也没这么匀。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00079',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00078 =====
    "n00078": {
        "speaker": '白沙手记',
        "text": """土色略深，其中夹杂细碎石灰颗粒。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00079',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00079 =====
    "n00079": {
        "speaker": '粟柏年',
        "text": """赵师傅的脚，比洛阳铲快。M1的墓道已经清出来了。今天先从墓门开始。""",
        "background_image": 'assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png',
        "choices": [],
        "next": 'n00080',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00080 =====
    "n00080": {
        "speaker": '白沙手记',
        "text": """墓道口在土岗东坡的断层上切出一道规整的开口。
粟柏年已经蹲在那儿了，手电光在晨雾里切出一道白柱，照在阶梯夯土的断面上。墓道北偏东十五度，现存长度将近六米，阶梯现存十一级，平坦部分将近两米。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00081',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00081 =====
    "n00081": {
        "speaker": '白沙手记',
        "text": """粟柏年没有立刻解释，而是把手电递给你。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00082',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00082 =====
    "n00082": {
        "speaker": '白沙手记',
        "text": """白光沿着夯土断面缓缓移动。
一层，又一层，颜色几乎一样，却又有细微区别。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00083',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00083 =====
    "n00083": {
        "speaker": '粟柏年',
        "text": """你先看。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00084',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00084 =====
    "n00084": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [
            {"text": '看夯层厚度', "next": 'n00085' },
            {"text": '看夯窝', "next": 'n00086' },
            {"text": '看土色', "next": 'n00087' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00085 =====
    "n00085": {
        "speaker": '白沙手记',
        "text": """夯层厚薄相近，像被人刻意控制过。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00088',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00086 =====
    "n00086": {
        "speaker": '白沙手记',
        "text": """断面上密布圆形浅坑，排列十分均匀。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00088',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00087 =====
    "n00087": {
        "speaker": '白沙手记',
        "text": """土色整体偏黄褐，没有明显变化。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00088',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00088 =====
    "n00088": {
        "speaker": '粟柏年',
        "text": """看见了吗？夯窝直径八公分，夯层十五公分左右。北宋中晚期常见规格，徽宗以后战乱多，工艺反而没这么规整。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00089',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00089 =====
    "n00089": {
        "speaker": '白沙手记',
        "text": """赵老倔蹲在一边，嘴里叼着旱烟袋。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00090',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00090 =====
    "n00090": {
        "speaker": '赵老倔',
        "text": """粟老师，你连夯窝大小都能量出来？""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00091',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00091 =====
    "n00091": {
        "speaker": '粟柏年',
        "text": """你踩得出来地下有没有空洞。这比量夯窝难。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00092',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00092 =====
    "n00092": {
        "speaker": '赵老倔',
        "text": """那是。俺的脚底板比眼睛好使。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00093',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00093 =====
    "n00093": {
        "speaker": '白沙手记',
        "text": """墓道尽头，封门砖露出来了，青灰色的砖墙，共三层。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00094',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00094 =====
    "n00094": {
        "speaker": '粟柏年',
        "text": """外层横砖加菱角牙子混砌，中层全部横砖，内层全部卧丁砖。你看这三层，拆的顺序应该是什么？""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00095',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00095 =====
    "n00095": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [
            {"text": '从外层开始拆', "next": 'n00096' },
            {"text": '从中层开始拆', "next": None },
            {"text": '从内层开始拆', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00096 =====
    "n00096": {
        "speaker": '白沙手记',
        "text": """外层混合砌法最不稳定，先拆它，内层还有中层抵着。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00097',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00097 =====
    "n00097": {
        "speaker": '粟柏年',
        "text": """正确，反过来就不行。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00098 =====
    "n00098": {
        "speaker": '白沙手记',
        "text": """中层被外层和内层夹住，贸然从中间动手，容易破坏整体受力。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00099',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00099 =====
    "n00099": {
        "speaker": '粟柏年',
        "text": """先别急，从外层开始。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00100 =====
    "n00100": {
        "speaker": '白沙手记',
        "text": """内层直接面对墓室内部，贸然拆除风险最大。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00101',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00101 =====
    "n00101": {
        "speaker": '粟柏年',
        "text": """不行，先保住里面。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00102',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00102 =====
    "n00102": {
        "speaker": '粟柏年',
        "text": """拆之前，先把最正中那块砖拓下来。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00103',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00103 =====
    "n00103": {
        "speaker": '白沙手记',
        "text": """你取出宣纸和拓包，蹲在砖前，砖面上刻着两个字：永安。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00104',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00104 =====
    "n00104": {
        "speaker": '白沙手记',
        "text": """拓包蘸墨，先在废纸上扑几遍，墨色匀了才上纸。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00105',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00105 =====
    "n00105": {
        "speaker": '白沙手记',
        "text": """粟柏年站在你身后看了看拓片。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00106',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00106 =====
    "n00106": {
        "speaker": '粟柏年',
        "text": """永安。你觉得是什么？""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00107',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00107 =====
    "n00107": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [
            {"text": '墓主人名字', "next": 'n00108' },
            {"text": '年号', "next": 'n00109' },
            {"text": '吉祥语', "next": 'n00110' },
            {"text": '暂时无法判断', "next": 'n00111' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00108 =====
    "n00108": {
        "speaker": '粟柏年',
        "text": """名字不能只凭两个字定。
先放一放。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00112',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00109 =====
    "n00109": {
        "speaker": '粟柏年',
        "text": """如果是年号，后面应该能和题记、地券互证。
现在还不能下结论。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00112',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00110 =====
    "n00110": {
        "speaker": '粟柏年',
        "text": """有可能。很多墓砖上确实会出现吉语。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00112',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00111 =====
    "n00111": {
        "speaker": '粟柏年',
        "text": """很好。答案也许在里面，也许永远没有答案。现在唯一确定的是——砖上有这两个字，先记为存疑。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00112',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00112 =====
    "n00112": {
        "speaker": '白沙手记',
        "text": """封门砖从外层开始逐块拆除。
陈怀远负责绘制封门砖的正视图，鼻梁上架着老花镜，一手按着坐标纸，运笔极稳。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00113',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00113 =====
    "n00113": {
        "speaker": '白沙手记',
        "text": """他忽然极低地哼了一句什么，调门起得很高，又陡然拐了个弯。
赵老倔手里撬棍一顿，头也不抬。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00114',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00114 =====
    "n00114": {
        "speaker": '赵老倔',
        "text": """老陈，你这嗓子，半夜能叫魂。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00115',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00115 =====
    "n00115": {
        "speaker": '白沙手记',
        "text": """陈怀远没接话，老花镜后面的嘴角动了动，铅笔没停。
周淼悄悄跟你使了个眼色，陈工高兴的时候才哼半句。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00116',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00116 =====
    "n00116": {
        "speaker": '白沙手记',
        "text": """赵老倔用撬棍撬起一块菱角牙子，歪头看了看墓砖的断面。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00117',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00117 =====
    "n00117": {
        "speaker": '赵老倔',
        "text": """这砖烧得透，火候足。烧一窑这样的砖，得废多少柴火。你说这人啊，活着的时候住砖房，死了还要住砖房，图啥呢？""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00118',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00118 =====
    "n00118": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [
            {"text": '“赵师傅，你家用的什么砖？”', "next": 'n00119' },
            {"text": '笑笑不说话，继续低头编号。', "next": None },
            {"text": '“九百年了，烧它的人早没了，它还在。”', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00119 =====
    "n00119": {
        "speaker": '白沙手记',
        "text": """赵老倔从嘴里抽出旱烟袋，在鞋底磕了两下。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00120',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00120 =====
    "n00120": {
        "speaker": '赵老倔',
        "text": """俺家是土坯砖，自己打的，哪用得起烧窑砖。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00121 =====
    "n00121": {
        "speaker": '白沙手记',
        "text": """你低头继续编号。赵老倔也不在意，又撬下一块砖，这次像是对着砖说的。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00122',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00122 =====
    "n00122": {
        "speaker": '赵老倔',
        "text": """九百年了，烧你的人早没了，你还在这儿。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00123 =====
    "n00123": {
        "speaker": '白沙手记',
        "text": """赵老倔愣了一下，旱烟袋停在嘴边。他歪头看了你一眼，然后“嘿”了一声。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00124',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00124 =====
    "n00124": {
        "speaker": '赵老倔',
        "text": """你这丫头，说话跟俺村东头算命的老王头似的。不过你说得对，烧它的人早没了，它还在这儿。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00125',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00125 =====
    "n00125": {
        "speaker": '白沙手记',
        "text": """他把撬棍插进下一块砖缝里，忽然又停了一下。
你透过刚取下的一块菱角牙子留下的砖孔往里看了一眼。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00126',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00126 =====
    "n00126": {
        "speaker": '白沙手记',
        "text": """手电光穿过中层横砖的灰缝，照到最内层卧丁砖的砖面上——一道细细的阴影从砖的右上角延伸到左下角，周围还有几道细小的分支纹路。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00127',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00127 =====
    "n00127": {
        "speaker": '白沙手记',
        "text": """有道裂缝，不足一毫米。但已经贯穿了整块卧丁砖。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00128',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00128 =====
    "n00128": {
        "speaker": '白沙手记',
        "text": """粟柏年蹲在你旁边，看了一会儿。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00129',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00129 =====
    "n00129": {
        "speaker": '粟柏年',
        "text": """你觉得接下来怎么做？""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00130',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00130 =====
    "n00130": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [
            {"text": '“继续拆吧。裂缝不大，应该不会有大问题。”', "next": 'n00131' },
            {"text": '“停。先架支撑。”', "next": None },
            {"text": '“我去叫陈工来看看，他经验丰富。”', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00131 =====
    "n00131": {
        "speaker": '白沙手记',
        "text": """粟柏年伸手按住你正准备递给赵老倔的下一块砖号，力道很轻，但很确定。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00132',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00132 =====
    "n00132": {
        "speaker": '粟柏年',
        "text": """裂缝的宽度不到一毫米。但它在内层卧丁砖上，这块砖直接承受墓室内部的压力。墓道填土清掉以后，外侧土压力会消失。如果墓室内部有局部坍塌，内层承担的力已经不均匀了。继续拆外层，这条裂缝会往哪个方向走？""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00133',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00133 =====
    "n00133": {
        "speaker": '白沙手记',
        "text": """他松开手，把决定权留给你。你沉默了几秒，对赵老倔说先停一下。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00134 =====
    "n00134": {
        "speaker": '粟柏年',
        "text": """好。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00136',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00135 =====
    "n00135": {
        "speaker": '粟柏年',
        "text": """可以。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00136',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00136 =====
    "n00136": {
        "speaker": '白沙手记',
        "text": """陈怀远放下绘图板走过来，蹲在砖孔前看了看。老花镜挂在胸口，他眯着眼看了很久。站起来，只说了两个字。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00137',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00137 =====
    "n00137": {
        "speaker": '陈怀远',
        "text": """架撑。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00138',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00138 =====
    "n00138": {
        "speaker": '白沙手记',
        "text": """粟柏年随即朝坡下喊赵师傅备木料。你在一旁看着两位前辈交流，陈怀远惜字如金，但他开口的时候，粟柏年从来不打断。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00139',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00139 =====
    "n00139": {
        "speaker": '白沙手记',
        "text": """赵老倔扛着木料过来，扎稳马步，双手托着立柱往上一顶，腮帮子鼓起，脖子上青筋跳了一下。
立柱架好之后，裂缝没有扩大。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00140',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00140 =====
    "n00140": {
        "speaker": '白沙手记',
        "text": """陈怀远从绘图板后面走出来，手里捏着皮卷尺，量了量立柱和过梁的夹角，又用手指敲了敲木料。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00141',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00141 =====
    "n00141": {
        "speaker": '陈怀远',
        "text": """稳了。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00142',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00142 =====
    "n00142": {
        "speaker": '白沙手记',
        "text": """粟柏年在那块砖的编号旁边用红笔圈了个圈，在备注栏写了一行字。你后来读到：取砖前外层支撑已撤除三分之一，裂缝未扩展。推测应力来自墓室内部崩毁的北壁。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00143',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00143 =====
    "n00143": {
        "speaker": '白沙手记',
        "text": """取下那块卧丁砖以后，你翻过来看。裂缝已经深入砖厚的一半。它被外层和中层压住，压了九百年。封门砖全部拆除，墓门后露出一片完整的黑暗，是被封存了九百年的黑暗。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00144',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00144 =====
    "n00144": {
        "speaker": '白沙手记',
        "text": """粟柏年举起手电，光柱射入墓门，像一枚细长的楔子，缓慢地钉进时间深处。他没有立刻进去，大家也都没有说话，连赵老倔都把旱烟袋从嘴边拿了下来。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00145',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00145 =====
    "n00145": {
        "speaker": '白沙手记',
        "text": """几秒钟后，粟柏年跨过门槛，成为九百年来第一个重新进入这里的人。大家按序步入。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00146',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00146 =====
    "n00146": {
        "speaker": '白沙手记',
        "text": """轮到你了，墓门就在眼前。九百年的黑暗安静地停留在里面。""",
        "background_image": 'assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png',
        "choices": [],
        "next": 'n00147',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00147 =====
    "n00147": {
        "speaker": '白沙手记',
        "text": """两扇版门通刷赭色，颜色沉得像凝固的血。每扇砌门钉七排，每排五钉，版门下缘距地面留有不到两指宽的空间，是宋代“断砌造”的遗痕。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00148',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00148 =====
    "n00148": {
        "speaker": '白沙手记',
        "text": """粟柏年停在版门前，手电光没有照正面，而是往上抬，照向门额背面。门额背面的砖面上，有一幅彩画，颜色已经褪了大半，但还能看出赭红色的云气纹和几点残留的石青色。线条是随手勾上去的，不像正面门额那样工整。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00149',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00149 =====
    "n00149": {
        "speaker": '白沙手记',
        "text": """你们跨过墓门，进入甬道，穿过甬道的瞬间，空间忽然打开了。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00150',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00150 =====
    "n00150": {
        "speaker": '白沙手记',
        "text": """手电光扫过穹窿顶，扫过乐伎，扫过屏风，扫过对坐而饮的夫妇。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00151',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00151 =====
    "n00151": {
        "speaker": '白沙手记',
        "text": """那些人物从砖壁上浮现出来的时候，你甚至产生了一瞬间错觉，仿佛宴席刚刚散去。酒还没有凉，乐声还停留在空气里，只是赴宴的人已经离开九百年了。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00152',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00152 =====
    "n00152": {
        "speaker": '白沙手记',
        "text": """周淼站住了，仰头看了很久。顶部用横砖叠涩内收，一层一层向中心聚拢，每层砖都比下一层往内缩进几寸。最顶心画着赭黄二色的叠胜图案，两个菱形相叠，线条简洁，她举起炭笔对着顶心比了比。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00153',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00153 =====
    "n00153": {
        "speaker": '白沙手记',
        "text": """刚进入甬道的时候，你的目光最先被什么吸引？""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00154',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00154 =====
    "n00154": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [
            {"text": '顶部叠胜', "next": 'n00155' },
            {"text": '东壁人物', "next": 'n00156' },
            {"text": '西壁马匹', "next": 'n00157' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00155 =====
    "n00155": {
        "speaker": '白沙手记',
        "text": """顶部的赭黄色叠胜最醒目，像一枚悬在空间中央的印记。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00158',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00156 =====
    "n00156": {
        "speaker": '白沙手记',
        "text": """东壁人物保存得更完整，司阍的衣纹甚至还能辨认。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00158',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00157 =====
    "n00157": {
        "speaker": '白沙手记',
        "text": """马匹体量最大，几乎占满了半面墙。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00158',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00158 =====
    "n00158": {
        "speaker": '白沙手记',
        "text": """无论看向哪里，你都会很快发现另一件事。单看一面，好像看不懂这里。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00159',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00159 =====
    "n00159": {
        "speaker": '周淼',
        "text": """这个叠胜和《营造法式》里的罗纹叠胜比起来简化了不少，颜色保存得真好。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00160',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00160 =====
    "n00160": {
        "speaker": '白沙手记',
        "text": """陈怀远从她身后走过去，用手电在顶部扫了一道。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00161',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00161 =====
    "n00161": {
        "speaker": '陈怀远',
        "text": """三面叠涩，横砖收顶。八层。内收弧度比正常的缓。最下面两层叠涩的砖角磨得比上面圆，可能是下葬时抬棺，棺底蹭的。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00162',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00162 =====
    "n00162": {
        "speaker": '白沙手记',
        "text": """粟柏年蹲在版门前面，用手铲尖端轻轻点了点版门下缘的空隙。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00163',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00163 =====
    "n00163": {
        "speaker": '粟柏年',
        "text": """《营造法式》里叫断砌门，不用地栿，门砧直接卧在砖地面上。北宋中期以后才流行起来。砚秋，记一下。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00164',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00164 =====
    "n00164": {
        "speaker": '粟柏年',
        "text": """你觉得这条甬道最重要的作用是什么？""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00165',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00165 =====
    "n00165": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [
            {"text": '通行', "next": 'n00166' },
            {"text": '装饰', "next": 'n00167' },
            {"text": '引导', "next": 'n00168' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00166 =====
    "n00166": {
        "speaker": '粟柏年',
        "text": """这是最基础的作用。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00169',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00167 =====
    "n00167": {
        "speaker": '粟柏年',
        "text": """确实有这方面的作用。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00169',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00168 =====
    "n00168": {
        "speaker": '粟柏年',
        "text": """接近了，但先别急着下结论。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00169',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00169 =====
    "n00169": {
        "speaker": '白沙手记',
        "text": """他抬起手电，先照顶部，再照东壁，最后照西壁。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00170',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00170 =====
    "n00170": {
        "speaker": '粟柏年',
        "text": """要三面合读。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00171',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00171 =====
    "n00171": {
        "speaker": '白沙手记',
        "text": """粟柏年为什么让你三面合读？
A. 因为三面壁画合在一起才能看懂甬道的整体装饰主题
B. 因为考古观察不能只盯着一个方向，顶部、侧壁、正面都要看
C. 因为东壁和西壁的壁画内容有矛盾，需要对照""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00172 =====
    "n00172": {
        "speaker": '粟柏年',
        "text": """主题和对照都不是重点。重点是方法：进到一个封闭空间，先定位置，再看顶部，然后扫两侧壁。三面信息合起来，才能判断这个空间在整座墓里承担什么功能。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00174',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00173 =====
    "n00173": {
        "speaker": '粟柏年',
        "text": """对。考古观察不是看画，是读空间。顶部给你方向，侧壁给你内容。三面合读，才能判断甬道是单纯的通道，还是在引导你进入前室。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00174',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00174 =====
    "n00174": {
        "speaker": '周淼',
        "text": """如果让你画这条甬道，你会先画哪里？""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00175',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00175 =====
    "n00175": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [
            {"text": '顶部', "next": 'n00176' },
            {"text": '东壁', "next": 'n00177' },
            {"text": '西壁', "next": 'n00178' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00176 =====
    "n00176": {
        "speaker": '周淼',
        "text": """我也是，空间关系先定下来，人物可以后补。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00179',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00177 =====
    "n00177": {
        "speaker": '周淼',
        "text": """人物好看。但容易丢掉空间感。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00179',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00178 =====
    "n00178": {
        "speaker": '周淼',
        "text": """马确实最显眼，不过最显眼的不一定最重要。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00179',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00179 =====
    "n00179": {
        "speaker": '白沙手记',
        "text": """周淼把画板竖起来，铅笔在纸上沙沙地画。她先勾了顶部的叠胜轮廓，然后在旁边分两栏，一栏记东壁人物，一栏记西壁人物。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00180',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00180 =====
    "n00180": {
        "speaker": '白沙手记',
        "text": """你最后回头看了一眼墓门，赭色版门已经退到黑暗里。而前方，前室的空间正在手电光里一点一点展开。""",
        "background_image": 'assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png',
        "choices": [],
        "next": 'n00181',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00181 =====
    "n00181": {
        "speaker": '白沙手记',
        "text": """穿过甬道，前室豁然开朗，手电光先照到了穹窿顶上的扁方形宝盖式盝顶藻井。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00182',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00182 =====
    "n00182": {
        "speaker": '白沙手记',
        "text": """垂旒相间用赭、青、黄、白四色，盝顶坡面上画着柿蒂纹和覆莲，顶心是绛青二色的叠胜。藻井四角的弧线柔和而精准。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00183',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00183 =====
    "n00183": {
        "speaker": '白沙手记',
        "text": """陈怀远站在前室正中，仰头看着穹窿顶，手里皮卷尺的一端垂在地面。他量了量盝顶四角的弦长，后退半步，眯起一只眼，像木匠看梁是否端正。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00184',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00184 =====
    "n00184": {
        "speaker": '陈怀远',
        "text": """四角起翘的弧度不一样。西北角比东南角缓了半寸。不是匠人失手，是地基沉降。九百年，土往下走了。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00185',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00185 =====
    "n00185": {
        "speaker": '白沙手记',
        "text": """粟柏年的手电在顶心停了一下，缓缓下落，扫过四壁。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00186',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00186 =====
    "n00186": {
        "speaker": '白沙手记',
        "text": """北壁是夫妇对坐图。男子面容饱满，蓄须，戴幞头，穿圆领袍。女子梳高髻，着对襟褙子。两人袖手而坐，身后各有一扇屏风，桌上有酒注、注碗、台盏、经瓶。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00187',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00187 =====
    "n00187": {
        "speaker": '白沙手记',
        "text": """东壁是女乐图，卷帘下，女乐十一人分左右两组。右侧五人击鼓、击拍板、击腰鼓、吹横笛、吹觱篥。
左侧五人吹箫、吹笙、吹排箫、弹琵琶。四排乐人之间，一人戴硬脚花额幞头，欠身扬袖作舞。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00188',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00188 =====
    "n00188": {
        "speaker": '白沙手记',
        "text": """西壁是墓主夫妇对坐像，用砖砌浮出壁面约五到十厘米。男袖手坐右侧，戴蓝帽，着圆领蓝袍。女袖手坐左侧，梳高髻方额，着绛襦白裙。二人皆侧身面东，观看东壁的乐舞。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00189',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00189 =====
    "n00189": {
        "speaker": '粟柏年',
        "text": """这是墓主人夫妇。东壁的乐和西壁的宴合在一起，就是‘开芳宴’。《醉翁谈录》里记的，宋人夫妇宴饮，常开芳宴，表夫妻相爱。注意看壁画的层次，西壁中心是砖砌的，桌椅、注子都是浮出壁面的。但屏风和侍者是画的。同一个场景，用了两种技法。你觉得为什么？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00190',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00190 =====
    "n00190": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '墓主人夫妇是整面壁画的中心，用浮雕凸显其核心地位。', "next": 'n00191' },
            {"text": '可能是两个不同的工匠团队分别完成的。', "next": 'n00192' },
            {"text": '砖浮雕更省钱，所以只做了墓主人夫妇。', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00191 =====
    "n00191": {
        "speaker": '粟柏年',
        "text": """砖浮雕的立体感让墓主人夫妇浮出壁面，被固定在中心位置，不容忽视。侍者和背景退到平面里，是陪衬。这种主次关系，就是宋人墓葬装饰的逻辑。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00193',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00192 =====
    "n00192": {
        "speaker": '白沙手记',
        "text": """你走到北壁前，侧光下，屏风山水画颜料龟裂的地方，隐约浮出几道极细的墨线。你下意识凑近。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00193',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00193 =====
    "n00193": {
        "speaker": '周淼',
        "text": """等等。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00194',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00194 =====
    "n00194": {
        "speaker": '白沙手记',
        "text": """她举起手电，从侧面照过去，这里不太对。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00195',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00195 =====
    "n00195": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '什么不对？', "next": 'n00196' },
        ],
        "next": 'n00196',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00196 =====
    "n00196": {
        "speaker": '白沙手记',
        "text": """她用炭笔在速写簿上快速勾出几笔。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00197',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00197 =====
    "n00197": {
        "speaker": '周淼',
        "text": """这一段不像山石皴法，倒像是后来补上去的线。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00198',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00198 =====
    "n00198": {
        "speaker": '白沙手记',
        "text": """陈怀远闻声走过来，老花镜往下一滑。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00199',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00199 =====
    "n00199": {
        "speaker": '陈怀远',
        "text": """后补的？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00200',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00200 =====
    "n00200": {
        "speaker": '周淼',
        "text": """像，但我不确定。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00201',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00201 =====
    "n00201": {
        "speaker": '白沙手记',
        "text": """粟柏年接过手电，只看了一眼。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00202',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00202 =====
    "n00202": {
        "speaker": '粟柏年',
        "text": """先完成壁面记录，不要让一个细节带着你跑。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00203',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00203 =====
    "n00203": {
        "speaker": '白沙手记',
        "text": """穿过前室南壁的短甬，空间忽然窄下来。墙壁从四面收拢，顶部的宝盖式盝顶变成更紧凑的丁字形收束。尽头更暗。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00204',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00204 =====
    "n00204": {
        "speaker": '白沙手记',
        "text": """周淼下意识往你身后退了半步。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00205',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00205 =====
    "n00205": {
        "speaker": '白沙手记',
        "text": """粟柏年的手电停在东壁。壁上有一行墨书，八个字，一笔一划，在赭红色的底色上显得格外清晰。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00206',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00206 =====
    "n00206": {
        "speaker": '粟柏年',
        "text": """你来读。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00207',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00207 =====
    "n00207": {
        "speaker": '白沙手记',
        "text": """你顺着笔势读下去，元符二年……赵大翁布。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00208',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00208 =====
    "n00208": {
        "speaker": '白沙手记',
        "text": """粟柏年把手电的光斑定在那行字上，沉默了很久。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00209',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00209 =====
    "n00209": {
        "speaker": '粟柏年',
        "text": """这行题记告诉我们什么？""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00210',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00210 =====
    "n00210": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [
            {"text": '墓的年代是元符二年，墓主姓赵。', "next": 'n00211' },
            {"text": '题记是后来的人写上去的。', "next": 'n00212' },
            {"text": '这只是一位工匠的名字。', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00211 =====
    "n00211": {
        "speaker": '粟柏年',
        "text": """元符二年，公元1099年。墓的年代定了。墓主姓赵，称大翁，没有官职。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00213',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00212 =====
    "n00212": {
        "speaker": '粟柏年',
        "text": """这笔墨是建墓的时候写的，不是后来加的。”大翁“是当时对没有官职的老年男子的尊称。这是墓主的称号，不是工匠的名字。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00213',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00213 =====
    "n00213": {
        "speaker": '白沙手记',
        "text": """陈怀远用手电照着西壁的破子棂窗，指尖虚虚地沿着窗格描了一遍。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00214',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00214 =====
    "n00214": {
        "speaker": '陈怀远',
        "text": """你看这窗，第一眼像什么？""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00215',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00215 =====
    "n00215": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [
            {"text": '格栅', "next": 'n00216' },
            {"text": '菱花', "next": 'n00217' },
            {"text": '门', "next": 'n00218' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00216 =====
    "n00216": {
        "speaker": '陈怀远',
        "text": """差不多。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00219',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00217 =====
    "n00217": {
        "speaker": '陈怀远',
        "text": """对，棂条旋转四十五度，所以会有这种感觉。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00219',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00218 =====
    "n00218": {
        "speaker": '陈怀远',
        "text": """不是门。九枚破子棂，斜向分开。《营造法式》里叫‘破子棂窗’，棂条断面是正方形旋转四十五度，像菱形。宋人做窗，不只为透光，也为看出去的时候，把外面的景切成碎片。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00219',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00219 =====
    "n00219": {
        "speaker": '陈怀远',
        "text": """这窗是假的，外面没有景。但做法和真窗一样。""",
        "background_image": 'assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png',
        "choices": [],
        "next": 'n00220',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00220 =====
    "n00220": {
        "speaker": '白沙手记',
        "text": """穿过过道后，空间一下收住了。墙更近，光更窄，声音也像被砖面吞掉。后室呈平面六角形，比前室紧凑得多。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00221',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00221 =====
    "n00221": {
        "speaker": '白沙手记',
        "text": """手电光落在砖壁上，光沿着砖缝转折，影子也跟着转折。
一面墙变成两面，两面变成四面，最后折出一个安静而封闭的六角形空间。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00222',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00222 =====
    "n00222": {
        "speaker": '白沙手记',
        "text": """仿佛有人把外面的世界一点一点削掉，只剩下这一间屋子，和屋子里停留了九百年的黑暗。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00223',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00223 =====
    "n00223": {
        "speaker": '白沙手记',
        "text": """粟柏年的手电直接打向北壁。正中砌着假门，门额上雕砖作门簪四枚。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00224',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00224 =====
    "n00224": {
        "speaker": '白沙手记',
        "text": """版门两扇，左扇向北微启。
砖雕女子立于门外，垂双髻，着窄袖衫和长裙，右手作启门状，脸微偏向门缝。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00225',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00225 =====
    "n00225": {
        "speaker": '粟柏年',
        "text": """妇人启门是宋代墓葬常见图像母题，表示门后还有庭院、厅堂，墓室至此未到尽头。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00226',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00226 =====
    "n00226": {
        "speaker": '白沙手记',
        "text": """粟柏年从假门前退开，手电光下落到北壁下部。一片低平的砖面铺展在地面上，是砖床。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00227',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00227 =====
    "n00227": {
        "speaker": '白沙手记',
        "text": """苏池蹲在砖床边，解开皮尺的金属搭扣，把零刻度端抵在北壁根，尺身沿着砖床的中轴铺开。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00228',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00228 =====
    "n00228": {
        "speaker": '苏池',
        "text": """砚秋，你来拉这头。拉到南沿，别斜。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00229',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00229 =====
    "n00229": {
        "speaker": '白沙手记',
        "text": """你跪下来拉住皮尺，金属头冰凉。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00230',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00230 =====
    "n00230": {
        "speaker": '苏池',
        "text": """一百八十六厘米。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00231',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00231 =====
    "n00231": {
        "speaker": '白沙手记',
        "text": """手电光移到砖床偏北的位置，有两具骨骼。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00232',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00232 =====
    "n00232": {
        "speaker": '白沙手记',
        "text": """头骨并列安放，枕骨朝下，面朝西偏北。
身体其余部分的骨骼混堆在头骨东侧，小骨片散乱重叠，像被时间打翻的一盒棋子。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00233',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00233 =====
    "n00233": {
        "speaker": '苏池',
        "text": """你觉得这两具的性别是？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00234',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00234 =====
    "n00234": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '两具都是男性', "next": 'n00235' },
            {"text": '一男一女', "next": 'n00236' },
            {"text": '看不出来', "next": 'n00237' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00235 =====
    "n00235": {
        "speaker": '白沙手记',
        "text": """你主要依据头骨大小判断。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00238',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00236 =====
    "n00236": {
        "speaker": '白沙手记',
        "text": """两具骨骼确实存在差异。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00238',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00237 =====
    "n00237": {
        "speaker": '苏池',
        "text": """很好，“不知道”也是一种判断。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00238',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00238 =====
    "n00238": {
        "speaker": '白沙手记',
        "text": """他拿起镊子。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00239',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00239 =====
    "n00239": {
        "speaker": '苏池',
        "text": """看盆骨。这具男，这具女。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00240',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00240 =====
    "n00240": {
        "speaker": '苏池',
        "text": """也可以看牙齿磨耗。男的臼齿磨耗到牙本质了，四十五到五十五岁。女的磨耗浅一些，大概年轻十岁。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00241',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00241 =====
    "n00241": {
        "speaker": '白沙手记',
        "text": """他忽然停下手里的镊子，从大衣口袋里摸出一块纱布，把镊子尖擦了擦。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00242',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00242 =====
    "n00242": {
        "speaker": '苏池',
        "text": """髋骨也能佐证。你看这个坐骨大切迹——"他用镊子尖轻轻拨开一块碎骨，露出下面的弧形边缘，"窄而深，是男性。女性通常宽而浅。"他把镊子柄递到你手里，"你自己碰一下。感觉一下这个弧度。不要猜，用手记。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00243',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00243 =====
    "n00243": {
        "speaker": '白沙手记',
        "text": """他又用小毛刷扫开一小块足骨的断面。头骨并列，其余骨骼混堆。棺材尺寸放不下两具完整的成人遗体。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00244',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00244 =====
    "n00244": {
        "speaker": '苏池',
        "text": """头骨并列。
其余骨骼混堆。
你觉得最可能是什么情况？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00245',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00245 =====
    "n00245": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '原葬', "next": 'n00246' },
            {"text": '迁葬', "next": 'n00247' },
            {"text": '盗扰', "next": 'n00248' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00246 =====
    "n00246": {
        "speaker": '苏池',
        "text": """如果原葬，骨骼不会只剩头部保持位置。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00249',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00247 =====
    "n00247": {
        "speaker": '苏池',
        "text": """接近了。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00249',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00248 =====
    "n00248": {
        "speaker": '苏池',
        "text": """盗扰会留下其他痕迹，目前还没看到。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00249',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00249 =====
    "n00249": {
        "speaker": '白沙手记',
        "text": """手电光从人骨位置向东移。砖床上有锈蚀铁钉和暗色痕迹，围出一片长约98厘米、宽约88厘米的不完全规整范围。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00250',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00250 =====
    "n00250": {
        "speaker": '白沙手记',
        "text": """铁钉排成两列，锈成了深褐色，苏池数了一遍，有十九枚。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00251',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00251 =====
    "n00251": {
        "speaker": '白沙手记',
        "text": """他蹲下来，用游标卡尺量了量其中一枚铁钉的残长，又看了看钉头的锈蚀程度。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00252',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00252 =====
    "n00252": {
        "speaker": '苏池',
        "text": """钉头截面不是方形，是梯形。棺材不是整板，是薄板拼的。下葬的时候，板子已经劈好了，钉子是现砸的。砸得急，有几枚歪了。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00253',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00253 =====
    "n00253": {
        "speaker": '粟柏年',
        "text": """对。铁钉首先是葬具复原线索。十九枚，围出约98厘米乘88厘米的范围。这能帮我们想象棺材的大小和位置。至于为什么分布不匀——木材腐朽、铁钉锈蚀、地层压力，都可能。不要把不规整直接解释为事件。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00254',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00254 =====
    "n00254": {
        "speaker": '白沙手记',
        "text": """手电光从砖床移向西壁下部，砖面上保留朱色文字，旁边配有券盖。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00255',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00255 =====
    "n00255": {
        "speaker": '白沙手记',
        "text": """地券为砖质朱书，十六行、倒写，券盖无字，并有“合同”背书。
第一行可辨认：“大宋元符二年九月十□日赵……”""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00256',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00256 =====
    "n00256": {
        "speaker": '粟柏年',
        "text": """砖质朱书，十六行，倒写。券盖无字，背面有‘合同’二字背书。这是宋代买地券的标准形制。‘合同’是阴阳两界的契约凭证。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00257',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00257 =====
    "n00257": {
        "speaker": '白沙手记',
        "text": """你凑近看。朱书字迹多漫漶，但“元符二年”四个字和过道题记对上了。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00258',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00258 =====
    "n00258": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '地券时间和题记一致。都是1099年。', "next": 'n00259' },
        ],
        "next": 'n00259',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00259 =====
    "n00259": {
        "speaker": '粟柏年',
        "text": """对。地券是建墓时埋的，题记也是建墓时写的。1099年是这座墓的时间锚点。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00260',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00260 =====
    "n00260": {
        "speaker": '白沙手记',
        "text": """手电光转向后室其他壁面。镜台、盆架、杌、高几、灯具、剪刀、熨斗散在几面墙上，后室多壁面可见生活化、寝居化器物图像。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00261',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00261 =====
    "n00261": {
        "speaker": '周淼',
        "text": """后室看起来很有生活感呀。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00262',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00262 =====
    "n00262": {
        "speaker": '白沙手记',
        "text": """赵老倔在墓室西北角敲了敲地砖，指节扣在砖面上，声音沉而闷。扣到第四块，声音忽然变了，空，脆，像敲在一口枯井的井沿上。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00263',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00263 =====
    "n00263": {
        "speaker": '白沙手记',
        "text": """几块方砖被撬开以后，露出一口长方形小室。一尺见方，三寸深，里面放着一只铜筒，两端密封，蜡封完好。蜡面泛着暗黄的光泽。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00264',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00264 =====
    "n00264": {
        "speaker": '赵老倔',
        "text": """慢着。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00265',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00265 =====
    "n00265": {
        "speaker": '白沙手记',
        "text": """赵老倔忽然伸手拦住正要开筒的粟柏年。他从腰间围裙的前兜里摸出三支旱烟卷，转身走到墓道口，用火镰打了好几下才点着，把烟卷插在封门砖缝里。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00266',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00266 =====
    "n00266": {
        "speaker": '白沙手记',
        "text": """青烟在晨光里直直地往上升。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00267',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00267 =====
    "n00267": {
        "speaker": '赵老倔',
        "text": """这筒子封了九百年。开之前，让地下的魂知道有人来了。俺爷爷那辈儿传下来的规矩，进人家的门，先递根烟。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00268',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00268 =====
    "n00268": {
        "speaker": '白沙手记',
        "text": """他退到一边，歪头看着铜筒。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00269',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00269 =====
    "n00269": {
        "speaker": '赵老倔',
        "text": """行了。开吧。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00270',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00270 =====
    "n00270": {
        "speaker": '白沙手记',
        "text": """陈怀远凑近铜筒看了看内壁，又用指甲轻轻刮了一点蜡封边缘的积垢，在指尖捻了捻。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00271',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00271 =====
    "n00271": {
        "speaker": '陈怀远',
        "text": """蜡封是蜂蜡混了松香，九百年没透气。里面要是写了字，墨不会氧化得太厉害。这筒子做得讲究，比地券的券盖还严实。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00272',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00272 =====
    "n00272": {
        "speaker": '白沙手记',
        "text": """粟柏年等那三支烟燃尽了，旋开筒盖。里面有两样东西：一卷绢帛，一方折叠整齐的素帛。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00273',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00273 =====
    "n00273": {
        "speaker": '白沙手记',
        "text": """素帛展开后约巴掌大小，上面用朱砂写着两行小字，字迹工整。
第一行：治小，知见人。
第二行：是征，书券人。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00274',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00274 =====
    "n00274": {
        "speaker": '白沙手记',
        "text": """两行字下面压着一枚朱砂指印，指纹的纹路和筒盖蜡封上那个隐约重合。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00275',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00275 =====
    "n00275": {
        "speaker": '粟柏年',
        "text": """这是反切注音法。取上一个字的声母，加下一个字的韵母和声调。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00276',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00276 =====
    "n00276": {
        "speaker": '白沙手记',
        "text": """周淼凑过来看了一眼，手指在空中比划了一下。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00277',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00277 =====
    "n00277": {
        "speaker": '周淼',
        "text": """治小……是赵吗？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00278',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00278 =====
    "n00278": {
        "speaker": '白沙手记',
        "text": """你觉得是什么？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00279',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00279 =====
    "n00279": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '赵', "next": 'n00280' },
            {"text": '晁', "next": 'n00281' },
            {"text": '沼', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00280 =====
    "n00280": {
        "speaker": '苏池',
        "text": """我也觉得是赵。颖东墓区的地券，知见人基本都是墓主同姓的族人。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00282',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00281 =====
    "n00281": {
        "speaker": '白沙手记',
        "text": """粟柏年把素帛平铺在工作台上，眉头微微皱起。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00282',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00282 =====
    "n00282": {
        "speaker": '粟柏年',
        "text": """这个切法用的是《广韵》音系。中古音和今天普通话之间差了一千多年的语音演变，有几条规律。他把自己的笔记本推到你面前。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00283',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00283 =====
    "n00283": {
        "speaker": '白沙手记',
        "text": """【知识卡片：反切注音法】
反切是中国古代用两个汉字给第三个汉字注音的方法。取上字的声母，加下字的韵母和声调，拼出目标字的读音。宋代通行的反切依据《广韵》音系，记录的是一千多年前的中古汉语发音。从《广韵》音系演变到现代普通话，主要发生了以下变化：""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00284',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00284 =====
    "n00284": {
        "speaker": '白沙手记',
        "text": """一、全浊清化
中古音里有一套全浊声母（发音时声带振动，如吴语中的"白""定""近"的声母）。现代普通话中已经没有这类浊声母，全部变成了清声母。变化规律：
- 全浊声母的平声字（今一声、二声）→ 送气清音（如p、t、k、ch、c等）
- 全浊声母的仄声字（上声、去声、入声）→ 不送气清音（如b、d、g、zh、z等）
- 例："同"是平声，变送气tóng；"动"是仄声，变不送气dòng""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00285',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00285 =====
    "n00285": {
        "speaker": '白沙手记',
        "text": """二、介音脱落
中古音中许多字的韵母带有一个-i-介音。在现代普通话里，当声母是卷舌音（zh、ch、sh、r）时，这个-i-介音脱落。
- 例："小"中古音韵母为-iɛu，在卷舌声母后脱落-i-，变为-ǎo""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00286',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00286 =====
    "n00286": {
        "speaker": '白沙手记',
        "text": """三、浊上归去
中古音中，声母为全浊的上声字，在现代普通话中绝大多数变为去声。
- 例："赵"中古音为上声（全浊声母），今音变去声zhào""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00287',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00287 =====
    "n00287": {
        "speaker": '白沙手记',
        "text": """你对照卡片重新看过。治小切——"治"属澄母仄声，清化后不送气，声母zh-；"小"的韵母带-i-介音，在卷舌声母后脱落，变为-ǎo；全浊上声字浊上归去，声调取去声。zh- + -ào → zhào。知见人的位置，常见同音姓氏中，赵最合理。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00288',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00288 =====
    "n00288": {
        "speaker": '白沙手记',
        "text": """陈怀远从画板后面抬起头，老花镜挂在胸口。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00289',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00289 =====
    "n00289": {
        "speaker": '陈怀远',
        "text": """是征切，书券人。这个切法拼出来是什么？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00290',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00290 =====
    "n00290": {
        "speaker": '粟柏年',
        "text": """是征切拼出的是‘诚’。上字‘是’属禅母仄声，清化后读不送气sh-。下字‘征’韵母为-ēng。切出的读音shēng，对应到‘诚’这个字上。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00291',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00291 =====
    "n00291": {
        "speaker": '白沙手记',
        "text": """他把素帛重新叠好，放在绢帛旁边。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00292',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00292 =====
    "n00292": {
        "speaker": '粟柏年',
        "text": """见证人，赵。书券人，诚。正文第一字，怀。合在一起——赵怀诚。他把全名拆成三份，藏在这只铜筒里。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00293',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00293 =====
    "n00293": {
        "speaker": '白沙手记',
        "text": """赵怀诚。
这个名字落下以后，墓室里忽然安静下来。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00294',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00294 =====
    "n00294": {
        "speaker": '白沙手记',
        "text": """最先说话的是周淼，她把绢帛举到灯下。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00295',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00295 =====
    "n00295": {
        "speaker": '周淼',
        "text": """等等，这块绢不太像墓里原配的东西。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00296',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00296 =====
    "n00296": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '什么意思？', "next": 'n00297' },
        ],
        "next": 'n00297',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00297 =====
    "n00297": {
        "speaker": '周淼',
        "text": """经纬密度太高。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00298',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00298 =====
    "n00298": {
        "speaker": '白沙手记',
        "text": """她用指尖轻轻比划。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00299',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00299 =====
    "n00299": {
        "speaker": '周淼',
        "text": """这种绢比地券用料好得多，更像专门保存的文书。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00300',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00300 =====
    "n00300": {
        "speaker": '白沙手记',
        "text": """陈怀远蹲到暗格边，手指轻轻敲了敲砖缘。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00301',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00301 =====
    "n00301": {
        "speaker": '陈怀远',
        "text": """我更在意这个。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00302',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00302 =====
    "n00302": {
        "speaker": '周淼',
        "text": """暗格？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00303',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00303 =====
    "n00303": {
        "speaker": '陈怀远',
        "text": """嗯，这里不承担受力。砖缝切口也和周围不太一样。我怀疑它未必和墓同时修建。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00304',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00304 =====
    "n00304": {
        "speaker": '白沙手记',
        "text": """赵老倔蹲在旁边。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00305',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00305 =====
    "n00305": {
        "speaker": '赵老倔',
        "text": """俺不识字，可一个人把名字拆三份藏起来。准有事瞒着人。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00306',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00306 =====
    "n00306": {
        "speaker": '白沙手记',
        "text": """众人同时笑了一下。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00307',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00307 =====
    "n00307": {
        "speaker": '粟柏年',
        "text": """目前我们只有两个证据。1099年，题记和地券。1106年，绢帛落款。至于中间发生过什么，暂时不知道。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00308',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00308 =====
    "n00308": {
        "speaker": '白沙手记',
        "text": """你从粟柏年手里接过绢帛。侧光下，墨迹清晰工整，但下端有几块区域被水渍浸染过。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00309',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00309 =====
    "n00309": {
        "speaker": '白沙手记',
        "text": """水渍边缘泛着淡淡的黄。你读出了第一段。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00310',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00310 =====
    "n00310": {
        "speaker": '白沙手记',
        "text": """怀诚谨记：余十六起家，三十成业，半生积蓄，尽在粮廪之间。平生所为，无不可对人言者。惟崇宁四年一事，耿耿于怀，夜不能寐。是岁秋，大水，颖河堤溃，三县漂没。朝廷赈粮不足，饥民鬻儿卖女。余心急如焚，闻知州李公讳明辅困于粮台，乃夜叩州府之门。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00311',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00311 =====
    "n00311": {
        "speaker": '白沙手记',
        "text": """李公曰：府库之粮，皆在簿册——
最后一个字残缺。
水渍刚好浸掉了最关键的那个字。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00312',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00312 =====
    "n00312": {
        "speaker": '白沙手记',
        "text": """你只能看见右侧一点残笔。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00313',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00313 =====
    "n00313": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '私', "next": 'n00314' },
            {"text": '官', "next": 'n00315' },
            {"text": '盗', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00314 =====
    "n00314": {
        "speaker": '白沙手记',
        "text": """你把残笔和上下文合起来看。感觉“私”最顺。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00316',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00315 =====
    "n00315": {
        "speaker": '白沙手记',
        "text": """字形似乎对不上，你重新比对上下文。最后写下：府库之粮，皆在簿册，私动一粒即斩。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00316',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00316 =====
    "n00316": {
        "speaker": '白沙手记',
        "text": """你继续往下读：若李公不知，便是小人自取，三千石算在小人头上。李公沉吟良久，终曰……
此处又一处水渍，模糊了后半句。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00317',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00317 =====
    "n00317": {
        "speaker": '白沙手记',
        "text": """辨认水渍下的字。是什么偏旁？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00318',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00318 =====
    "n00318": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '酉', "next": 'n00319' },
            {"text": '目', "next": 'n00320' },
            {"text": '心', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00319 =====
    "n00319": {
        "speaker": '白沙手记',
        "text": """水渍下面露出一点“酉”旁，像“酒”。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00321',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00320 =====
    "n00320": {
        "speaker": '白沙手记',
        "text": """偏旁位置不对，你换了个角度照光。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00321',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00321 =====
    "n00321": {
        "speaker": '白沙手记',
        "text": """“酉”旁浮出来了。你念出：本官今夜酒醉，不省人事。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00322',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00322 =====
    "n00322": {
        "speaker": '白沙手记',
        "text": """之后余以李公手谕开了府库，调三千石粮，又以自家粮米抵还。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00323',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00323 =====
    "n00323": {
        "speaker": '白沙手记',
        "text": """最后一处又有残损。
你把绢帛拿到灯下，侧光极斜地照过去。几个字的结体从水渍里浮出来。第一个字，笔画中有“矢”部。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00324',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00324 =====
    "n00324": {
        "speaker": '白沙手记',
        "text": """“矢”部开头，接下去最可能是哪个字？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00325',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00325 =====
    "n00325": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '知', "next": 'n00326' },
            {"text": '矩', "next": 'n00327' },
            {"text": '矫', "next": None },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00326 =====
    "n00326": {
        "speaker": '白沙手记',
        "text": """“矢”部之后接“口”，是“知”。你念出最后一行：知我罪我，惟待后人。崇宁五年腊月。赵怀诚泣血谨记。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00328',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00327 =====
    "n00327": {
        "speaker": '周淼',
        "text": """我觉得像是知。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00328',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00328 =====
    "n00328": {
        "speaker": '白沙手记',
        "text": """绢帛摊在你面前，周淼把素帛轻轻挪了个位置，让它和绢帛并排放在一起。她盯着绢帛下端那几块水渍看了很久，忽然低声说""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00329',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00329 =====
    "n00329": {
        "speaker": '周淼',
        "text": """这些字被水泡过……他写的时候是不是在哭。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00330',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00330 =====
    "n00330": {
        "speaker": '白沙手记',
        "text": """众人默默无话。粟柏年把铜筒盖好，素帛叠好，压在绢帛上面。他把铜筒放回暗格里。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00331',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00331 =====
    "n00331": {
        "speaker": '白沙手记',
        "text": """一号墓的全部测绘和记录工作接近尾声。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00332',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00332 =====
    "n00332": {
        "speaker": '白沙手记',
        "text": """粟柏年在帆布棚下铺开一张大白纸，六个方框从左到右排开，像一条被拉直的墓道轴线。
他递给你一叠剪好的小纸条和三支不同颜色的铅笔。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00333',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00333 =====
    "n00333": {
        "speaker": '粟柏年',
        "text": """现在，把你这一路记下的所有线索，按三种颜色分类。红——可判断。蓝——可推测。黑——仍存疑。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00334',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00334 =====
    "n00334": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '【第一栏：可判断——你拿起红色的铅笔。】\n以下哪些线索应放入“可判断”栏？（多选）\nA. M1墓葬的空间序列\nB. “永安”一定是墓主人名字\nC. 过道题记“元符二年赵大翁布”\nD. 后室出土两具人骨\nE. 赵怀诚就是墓主人\nF. 地券与题记同为1099年\nG. 银扣来自M1', "next": 'n00335' },
        ],
        "next": 'n00335',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00335 =====
    "n00335": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '【第二栏：依据材料可以推测】\n以下哪些线索应放入蓝栏？\n（多选）\nA. 人骨位置支持迁葬可能\nB. 赵大翁与赵怀诚可能存在关联\nC. 铁钉分布可用于复原棺木位置\nD. 赵怀诚一定盗开过粮仓\nE. 绢帛提供了一种人物经历解释\nF. 墓主人必定死于洪灾', "next": 'n00336' },
        ],
        "next": 'n00336',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00336 =====
    "n00336": {
        "speaker": '你',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '【第三栏：材料暂时无法回答】\n以下哪些线索应放入黑栏？\n（多选）\nA. “永安”的真实含义\nB. 迁葬发生的具体原因\nC. 赵大翁与赵怀诚是否为同一人\nD. 屏风细线是否构成文字\nE. 墓主人完整生平\nF. 暗格是否属于原始设计', "next": 'n00337' },
        ],
        "next": 'n00337',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00337 =====
    "n00337": {
        "speaker": '白沙手记',
        "text": """粟柏年把三栏纸条压平，抬头看着你。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00338',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00338 =====
    "n00338": {
        "speaker": '粟柏年',
        "text": """现在，回答我一个问题。赵怀诚线是不是最终真相？""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00339',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00339 =====
    "n00339": {
        "speaker": '白沙手记',
        "text": """""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [
            {"text": '是', "next": 'n00340' },
            {"text": '不是', "next": 'n00341' },
            {"text": '无法判断', "next": 'n00342' },
        ],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00340 =====
    "n00340": {
        "speaker": '粟柏年',
        "text": """错。动人的故事，不等于最终结论。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00343',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00341 =====
    "n00341": {
        "speaker": '粟柏年',
        "text": """对。赵怀诚线可以解释一些事情，但解释不能反过来改写证据。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00343',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00342 =====
    "n00342": {
        "speaker": '粟柏年',
        "text": """还差一步。
我们不是不知道。
而是知道哪些东西能够证明，哪些东西不能。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00343',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00343 =====
    "n00343": {
        "speaker": '白沙手记',
        "text": """他站起来，把三栏报告折好，放进一个牛皮纸档案袋里。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00344',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00344 =====
    "n00344": {
        "speaker": '粟柏年',
        "text": """这份报告，红栏是骨架，蓝栏是血肉，黑栏是留白。没有留白的画，不是好画。""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00345',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00345 =====
    "n00345": {
        "speaker": '白沙手记',
        "text": """而你终于明白，这座墓真正教会你的，不是谁埋在这里，而是该怎样面对一座墓。
---""",
        "background_image": 'assets/M1/16_出土器物与人骨/地券.png',
        "choices": [],
        "next": 'n00346',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00346 =====
    "n00346": {
        "speaker": '白沙手记',
        "text": """清理收尾阶段。第二层砖床下出了一枚铜钱，面铸篆书“绍圣元宝”，压在砖床正中一个小方孔上方——那是宋代风水书里叫“金井”的位置。粟柏年看了一眼说是镇墓钱。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00347',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00347 =====
    "n00347": {
        "speaker": '白沙手记',
        "text": """前室西南隅出了两块陶瓮残片。砖床上还有一堆锈碎的残铁器和两块长方形铁块，粟柏年判断是镇压用的生铁。两件白瓷碗，灰胎，白釉，撇口，圈足。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00348',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00348 =====
    "n00348": {
        "speaker": '白沙手记',
        "text": """赵老倔把瓷片一片一片捡进竹筐里，嘴里嘟囔：""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00349',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00349 =====
    "n00349": {
        "speaker": '赵老倔',
        "text": """这么有钱的人，陪葬就这么点东西？""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00350',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00350 =====
    "n00350": {
        "speaker": '粟柏年',
        "text": """对。宋人烧纸明器，用纸扎的东西代替实物，在坟前烧掉。墓室里画满壁画，画上的金银铤、钱贯、家具、仆役就是陪葬。实物不需要放太多。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00351',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00351 =====
    "n00351": {
        "speaker": '白沙手记',
        "text": """一号墓全部测绘和记录工作于12月31日中午完成。
陈怀远把最后一张测绘图从坐标纸上揭下来，对着光看了一遍，点了点头，卷好放进图筒。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00352',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00352 =====
    "n00352": {
        "speaker": '白沙手记',
        "text": """周淼在东壁前站了最后一次，把吹排箫乐伎的衣纹线条又勾了一遍，然后合上速写簿，对着壁画轻轻点了一下头。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00353',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00353 =====
    "n00353": {
        "speaker": '白沙手记',
        "text": """赵老倔把撬棍和铁锹收好，蹲在墓道口抽了最后一支烟。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00354',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00354 =====
    "n00354": {
        "speaker": '白沙手记',
        "text": """苏池最后一个从后室出来，手里端着木盘，盘里的骨样标本一块一块摆得整整齐齐。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00355',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00355 =====
    "n00355": {
        "speaker": '白沙手记',
        "text": """粟柏年在下午宣布，明天调人手去西北方向。12月21日，民工已经在二十米外发现了第二处砖顶。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00356',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00356 =====
    "n00356": {
        "speaker": '白沙手记',
        "text": """收工前，你最后一次走进后室。手电光照在北壁假门上。
那个砖雕女子，垂双髻，右手作启门状。门微启，左扇永远停在推开的角度上。她在黑暗里站了九百多年。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00357',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00357 =====
    "n00357": {
        "speaker": '白沙手记',
        "text": """粟柏年在墓门外等你。陈怀远站在他旁边。周淼抱着速写簿，围巾被风吹得翻起来。苏池端着木盘走过来。赵老倔已经在坡下喊吃饭了。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00358',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00358 =====
    "n00358": {
        "speaker": '白沙手记',
        "text": """粟柏年把木门合上，亲手上了锁。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00359',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00359 =====
    "n00359": {
        "speaker": '粟柏年',
        "text": """第一号墓发掘工作至此全部结束。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00360',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00360 =====
    "n00360": {
        "speaker": '白沙手记',
        "text": """他翻开记录本，在当天日志末尾写了一行字。写完之后拧上钢笔帽，抬头看了你一眼。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00361',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00361 =====
    "n00361": {
        "speaker": '粟柏年',
        "text": """明天。二号墓。""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": 'n00362',
        "portrait": None,
        "puzzle": None,
    },

    # ===== n00362 =====
    "n00362": {
        "speaker": '白沙手记',
        "text": """——全剧终——""",
        "background_image": 'assets/M1/17_补充总览图/P0-4_后室入口总览图.png',
        "choices": [],
        "next": None,
        "portrait": None,
        "puzzle": None,
    },

}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    # resume=1 表示从墓门解密返回，保持 session
    if request.args.get('resume') != '1':
        session.clear()
        session['current_dialogue'] = 'n00001'
        session['inventory'] = []
        session['flags'] = {}
    debug_mode = request.args.get('debug') == '1'
    return render_template('game.html', debug_mode=debug_mode)

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

    dialogue_id = session.get('current_dialogue', 'n00001')
    dialogue = get_dialogue(dialogue_id)
    if dialogue is None:
        dialogue_id = 'n00001'
        dialogue = DIALOGUES.get('n00001', {})
        session['current_dialogue'] = dialogue_id

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
        'chapter_id': get_chapter_for_node(dialogue_id),
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
    return jsonify({'current': session.get('current_dialogue', 'n00001'), 'nodes': items})

@app.route('/api/reset', methods=['POST'])
def reset():
    session.clear()
    return jsonify({'status': 'ok'})

@app.route('/api/chapters')
def chapters_api():
    """返回章节配置"""
    chapters = load_chapters()
    return jsonify({'chapters': chapters})

@app.route('/api/chapters/save', methods=['POST'])
def chapters_save_api():
    """保存章节配置"""
    data = request.get_json() or {}
    chapters = data.get('chapters', [])
    save_chapters(chapters)
    return jsonify({'status': 'ok', 'count': len(chapters)})


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
            'default_choices': d.get('choices') or [],
            'override_speaker': ov.get('speaker'),
            'override_text': ov.get('text'),
            'override_bg': ov.get('bg'),
            'override_portrait': ov.get('portrait'),
            'override_next': ov.get('next'),
            'override_choices': ov.get('choices'),
            'effective_speaker': eff_speaker,
            'effective_text': eff_text,
            'effective_bg': eff_bg,
            'effective_portrait': eff_portrait,
            'effective_next': eff_next,
            'effective_choices': ov.get('choices') if ov.get('choices') is not None else (d.get('choices') or []),
            'preview': (eff_text.replace('\n', ' ')[:80] if eff_text else '') or ('❖ ' + ' | '.join([c.get('text','') for c in (d.get('choices') or [])])[:60]),
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
            'default_choices': [],
            'override_speaker': d.get('speaker'),
            'override_text': d.get('text'),
            'override_bg': d.get('bg'),
            'override_portrait': d.get('portrait'),
            'override_next': d.get('next'),
            'override_choices': d.get('choices'),
            'effective_speaker': d.get('speaker') or '',
            'effective_text': eff_text,
            'effective_bg': d.get('bg'),
            'effective_portrait': d.get('portrait'),
            'effective_next': d.get('next'),
            'effective_choices': d.get('choices') or [],
            'preview': (eff_text.replace('\n', ' ')[:80] if eff_text else '') or ('❖ ' + ' | '.join([c.get('text','') for c in (d.get('choices') or [])])[:60]),
            'has_choices': bool(d.get('choices')),
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
            'override_choices': ov.get('choices'),
            'effective_speaker': ov.get('speaker') or d.get('speaker', ''),
            'effective_text': ov.get('text') if ov.get('text') is not None else (d.get('text') or ''),
            'effective_bg': ov.get('bg') or d.get('background_image'),
            'effective_portrait': ov.get('portrait') or d.get('portrait'),
            'effective_next': ov.get('next') if ov.get('next') is not None else d.get('next'),
            'effective_choices': ov.get('choices') if ov.get('choices') is not None else (d.get('choices') or []),
        }
    if node_id in custom:
        d = custom[node_id]
        return {
            'override_speaker': d.get('speaker'),
            'override_text': d.get('text'),
            'override_bg': d.get('bg'),
            'override_portrait': d.get('portrait'),
            'override_next': d.get('next'),
            'override_choices': d.get('choices'),
            'effective_speaker': d.get('speaker') or '',
            'effective_text': d.get('text') or '',
            'effective_bg': d.get('bg'),
            'effective_portrait': d.get('portrait'),
            'effective_next': d.get('next'),
            'effective_choices': d.get('choices') or [],
        }
    return None

@app.route('/api/admin/bg/save', methods=['POST'])
def admin_bg_save():
    """保存覆盖。请求体：{node_id, field, value}。field 为 bg/speaker/text/portrait/next。value 为空字符串 = 重置。"""
    data = request.get_json() or {}
    node_id = data.get('node_id')
    field = data.get('field')
    value = data.get('value', '')
    if field not in ('bg', 'speaker', 'text', 'portrait', 'next', 'choices'):
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
        if field == 'choices':
            if value == '' or value is None or (isinstance(value, list) and len(value) == 0):
                node.pop(field, None)
            else:
                node[field] = value
        else:
            if value == '' or value is None:
                node.pop(field, None)
            else:
                node[field] = value
        custom[node_id] = node
        overrides[CUSTOM_NODES_KEY] = custom
    else:
        # 原生节点：走 overrides
        node_ov = overrides.get(node_id, {})
        if field == 'choices':
            if value == '' or value is None or (isinstance(value, list) and len(value) == 0):
                node_ov.pop(field, None)
            else:
                node_ov[field] = value
        else:
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

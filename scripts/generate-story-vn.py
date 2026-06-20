# -*- coding: utf-8 -*-
"""Generate the front-end visual-novel story data from the merged story sources."""

from __future__ import annotations

import ast
import json
from pathlib import Path


KICKER = "白沙手记"
PORTRAIT_DIR = "assets/story/portraits"
NON_PORTRAIT_SPEAKERS = {"旁白", "系统", "你", "林砚秋", "声明"}
PORTRAITS = {
    "来人": f"{PORTRAIT_DIR}/周淼.png",
    "周淼": f"{PORTRAIT_DIR}/周淼.png",
    "苏池": f"{PORTRAIT_DIR}/苏池.png",
    "粟柏年": f"{PORTRAIT_DIR}/粟柏年.png",
    "陈怀远": f"{PORTRAIT_DIR}/陈怀远.png",
    "赵老倔": f"{PORTRAIT_DIR}/赵老倔.png",
    "赵广田": f"{PORTRAIT_DIR}/赵老倔.png",
    "民工老张": f"{PORTRAIT_DIR}/赵老倔.png",
    "常福来": f"{PORTRAIT_DIR}/赵老倔.png",
    "考古领队": f"{PORTRAIT_DIR}/粟柏年.png",
    "记录员": f"{PORTRAIT_DIR}/周淼.png",
    "考古队员": f"{PORTRAIT_DIR}/周淼.png",
    "考古技工": f"{PORTRAIT_DIR}/陈怀远.png",
}


def display_speaker(speaker: str) -> str:
    if speaker and set(speaker) == {"?"}:
        return "来人"
    if speaker == "系统":
        return "旁白"
    return speaker or ""


def portrait_for(speaker: str) -> str | None:
    display = display_speaker(speaker)
    if display in NON_PORTRAIT_SPEAKERS:
        return None
    return PORTRAITS.get(display)


def load_dialogues() -> dict:
    source = Path("baisha_chenyan/app.py")
    tree = ast.parse(source.read_text(encoding="utf-8"))
    for item in tree.body:
        if isinstance(item, ast.Assign) and any(getattr(target, "id", None) == "DIALOGUES" for target in item.targets):
            return ast.literal_eval(item.value)
    raise RuntimeError("DIALOGUES not found")


def split_story_sections() -> dict[str, str]:
    text = Path("剧情文案/加入线索后的最终剧情_融合版.md").read_text(encoding="utf-8")
    sections: dict[str, str] = {}
    current = ""
    buffer: list[str] = []
    for line in text.splitlines():
        if line.startswith("## "):
            if current:
                sections[current] = "\n".join(buffer).strip()
            current = line[3:].strip()
            buffer = []
        elif current:
            buffer.append(line)
    if current:
        sections[current] = "\n".join(buffer).strip()
    return sections


SECTIONS = split_story_sections()


def paras(section_name: str) -> list[str]:
    return [item.strip() for item in SECTIONS.get(section_name, "").split("\n\n") if item.strip()]


def by_indices(section_name: str, indices: list[int]) -> str:
    items = paras(section_name)
    return "\n\n".join(items[index] for index in indices if 0 <= index < len(items))


def find_para(section_name: str, needle: str, extra: int = 0) -> str:
    items = paras(section_name)
    for index, item in enumerate(items):
        if needle in item:
            end = min(len(items), index + 1 + extra)
            return "\n\n".join(items[index:end])
    return ""


def make_node(node_id: str, speaker: str, body: str, background: str, next_id: str | None = None, choices: list[dict] | None = None) -> dict:
    return {
        "id": node_id,
        "kicker": KICKER,
        "speaker": speaker,
        "body": body or "记录到这里先停一下。",
        "backgroundImage": background,
        "portrait": portrait_for(speaker),
        "choices": choices or [],
        "next": next_id,
        "puzzle": None,
    }


def event(start: str, nodes: list[str]) -> dict:
    return {"start": start, "nodes": nodes}


def build_nodes() -> dict:
    nodes = {}
    for node_id, value in load_dialogues().items():
        speaker = display_speaker(value.get("speaker", ""))
        nodes[node_id] = {
            "id": node_id,
            "kicker": KICKER,
            "speaker": speaker,
            "body": value.get("text", ""),
            "backgroundImage": value.get("background_image"),
            "portrait": value.get("portrait") or portrait_for(speaker),
            "choices": value.get("choices") or [],
            "next": value.get("next"),
            "puzzle": value.get("puzzle"),
        }

    nodes.update(
        {
            "m1_environment_entry": make_node("m1_environment_entry", "粟柏年", by_indices("墓外", [0, 1, 2, 3]), "assets/M1/01环境地图/白沙宋墓地形图.png", "m1_environment_task"),
            "m1_environment_task": make_node("m1_environment_task", "粟柏年", by_indices("墓外", [9, 10, 11]), "assets/M1/00_墓葬全景与结构图/第一号墓平剖面图.png"),
            "m1_environment_complete": make_node("m1_environment_complete", "粟柏年", by_indices("墓外", [4, 5, 6, 7, 8]), "assets/M1/01环境地图/白沙宋墓地形图.png", "m1_environment_complete_zhou"),
            "m1_environment_complete_zhou": make_node("m1_environment_complete_zhou", "周淼", find_para("墓外", "比例不准"), "assets/M1/00_墓葬全景与结构图/第一号墓平剖面图.png"),
            "m1_gate_lintel_back": make_node("m1_gate_lintel_back", "粟柏年", find_para("墓门", "正面是规矩", 1), "assets/M1/02墓道与墓门/墓门.png", "m1_gate_lintel_zhou"),
            "m1_gate_lintel_zhou": make_node("m1_gate_lintel_zhou", "周淼", find_para("墓门", "云气纹", 1), "assets/M1/02墓道与墓门/墓门.png"),
            "m1_corridor_entry": make_node("m1_corridor_entry", "周淼", by_indices("甬道", [0, 1, 2, 3, 4]), "assets/M1/03_甬道/M1 甬道.png", "m1_corridor_method"),
            "m1_corridor_method": make_node("m1_corridor_method", "粟柏年", find_para("甬道", "别只往前走"), "assets/M1/03_甬道/M1 甬道.png"),
            "m1_corridor_after_puzzle": make_node("m1_corridor_after_puzzle", "周淼", find_para("甬道", "东壁司阍"), "assets/M1/03_甬道/M1 甬道.png"),
            "m1_corridor_question": make_node(
                "m1_corridor_question",
                "粟柏年",
                find_para("甬道", "为什么让你三面合读"),
                "assets/M1/03_甬道/M1 甬道.png",
                choices=[
                    {"text": "因为三面壁画合在一起才能看懂装饰主题", "next": "m1_corridor_wrong"},
                    {"text": "因为顶部、两壁共同决定甬道的空间功能", "next": "m1_corridor_correct"},
                ],
            ),
            "m1_corridor_wrong": make_node("m1_corridor_wrong", "粟柏年", "主题和对照都不是重点。重点是方法：进到一个封闭空间，先定位置，再看顶部，然后扫两侧壁。", "assets/M1/03_甬道/M1 甬道.png", "m1_corridor_correct"),
            "m1_corridor_correct": make_node("m1_corridor_correct", "粟柏年", find_para("甬道", "考古观察不是看画"), "assets/M1/03_甬道/M1 甬道.png"),
            "m1_front_entry": make_node("m1_front_entry", "陈怀远", by_indices("前室", [0, 1, 2, 3]), "assets/M1/06_前室_南壁/第一号墓前室南壁壁画.png", "m1_front_zhou"),
            "m1_front_zhou": make_node("m1_front_zhou", "周淼", by_indices("前室", [5, 6, 7, 8, 9]), "assets/M1/05_前室_东壁/第一号墓前室东壁壁画.png"),
            "m1_front_method_question": make_node(
                "m1_front_method_question",
                "粟柏年",
                find_para("前室", "前室不能只看", 1),
                "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
                choices=[
                    {"text": "因为漂亮画面更容易吸引视线", "next": "m1_front_wrong"},
                    {"text": "因为前室结论来自人物、器物、入口和顶部的互相校验", "next": "m1_front_correct"},
                ],
            ),
            "m1_front_wrong": make_node("m1_front_wrong", "粟柏年", "漂亮画面不能替你完成判断。前室要看人物、器物、入口和顶部是怎么同时组织起来的。", "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png", "m1_front_correct"),
            "m1_front_correct": make_node("m1_front_correct", "粟柏年", "对。前室成立的不是一张漂亮壁画，而是一套被组织过的礼仪空间。", "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png"),
            "m1_passage_entry": make_node("m1_passage_entry", "周淼", by_indices("过道", [0, 1, 2]), "assets/M1/10_过道/第一号墓过道东壁题记.png", "m1_passage_inscription"),
            "m1_passage_inscription": make_node("m1_passage_inscription", "粟柏年", by_indices("过道", [3, 4, 5, 6]), "assets/M1/10_过道/第一号墓过道东壁题记.png"),
            "m1_passage_question": make_node(
                "m1_passage_question",
                "粟柏年",
                find_para("过道", "赵大翁"),
                "assets/M1/10_过道/第一号墓过道东壁题记.png",
                choices=[
                    {"text": "赵大翁就是墓主真实姓名", "next": "m1_passage_wrong"},
                    {"text": "大翁是称谓，题记只能先作时间锚点", "next": "m1_passage_correct"},
                ],
            ),
            "m1_passage_wrong": make_node("m1_passage_wrong", "粟柏年", "大翁是尊称，不是名字。真实姓名、身份关系、后室遗存，都不能单凭题记定案。", "assets/M1/10_过道/第一号墓过道东壁题记.png", "m1_passage_correct"),
            "m1_passage_correct": make_node("m1_passage_correct", "粟柏年", find_para("过道", "题记是锚点"), "assets/M1/10_过道/第一号墓过道东壁题记.png", "m1_passage_space"),
            "m1_passage_space": make_node("m1_passage_space", "陈怀远", find_para("过道", "九枚破子棂"), "assets/M1/10_过道/第一号墓过道西壁.png"),
            "m1_rear_entry": make_node("m1_rear_entry", "粟柏年", by_indices("后室", [0, 1, 2, 3]), "assets/M1/11_后室_南壁/第一号墓后室南壁.png", "m1_rear_bed"),
            "m1_rear_false_door": make_node("m1_rear_false_door", "粟柏年", by_indices("后室", [0, 1, 2, 3]), "assets/M1/12_后室_东北壁与西北壁/第一号墓后室北壁假门.png"),
            "m1_rear_bed": make_node("m1_rear_bed", "苏池", by_indices("后室", [8, 9, 10, 11, 12, 13]), "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png"),
            "m1_rear_bones": make_node("m1_rear_bones", "苏池", find_para("后室", "头骨并列", 2), "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png", "m1_rear_boundary"),
            "m1_rear_boundary": make_node("m1_rear_boundary", "粟柏年", find_para("后室", "人骨是事实"), "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png"),
            "m1_rear_question": make_node(
                "m1_rear_question",
                "苏池",
                "两具骨骼为什么会呈现头骨并列、其余骨骼混堆？",
                "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
                choices=[
                    {"text": "被火烧过，骨殖散乱", "next": "m1_rear_wrong"},
                    {"text": "墓被盗扰，盗墓者翻乱了", "next": "m1_rear_wrong"},
                    {"text": "迁葬时骨骼已经二次收拾", "next": "m1_rear_correct"},
                ],
            ),
            "m1_rear_wrong": make_node("m1_rear_wrong", "苏池", "盗扰和焚烧都要有对应痕迹。这里首先要回到尺寸、范围和骨骼状态。", "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png", "m1_rear_correct"),
            "m1_rear_correct": make_node("m1_rear_correct", "苏池", "对。迁葬。判断可以写，但身份关系还不能写死。地券、砖床、人骨、铁钉和日常器物，要分栏再合看。", "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png"),
        }
    )
    return nodes


EVENTS = {
    "opening": event("start", ["start", "arrive", "meet_su", "su_intro", "zhou_hello", "ask_time", "insist_time", "go_to_site", "meet_su_teacher", "question_1", "wrong_answer", "correct_answer", "correct_answer_force", "teacher_intro", "teacher_say"]),
    "scene_entry_environment": event("m1_environment_entry", ["m1_environment_entry", "m1_environment_task"]),
    "scene_complete_environment": event("m1_environment_complete", ["m1_environment_complete", "m1_environment_complete_zhou"]),
    "scene_entry_tomb_gate": event("chapter1", ["chapter1", "brick_wall"]),
    "clue_tomb_gate:brick_seam": event("find_crack", ["find_crack", "crack_decision", "wrong_decision", "wrong_decision_end", "correct_decision", "after_correct"]),
    "clue_tomb_gate:lintel_back": event("m1_gate_lintel_back", ["m1_gate_lintel_back", "m1_gate_lintel_zhou"]),
    "puzzle_mg_dig_match3_complete": event("door_reveal", ["door_reveal"]),
    "scene_complete_tomb_gate": event("door_examined", ["door_examined", "discover_second_tomb", "su_response"]),
    "scene_entry_corridor": event("m1_corridor_entry", ["m1_corridor_entry", "m1_corridor_method"]),
    "clue_corridor:corridor_roof": event("m1_corridor_method", ["m1_corridor_method"]),
    "puzzle_corridor_pattern_align_complete": event("m1_corridor_after_puzzle", ["m1_corridor_after_puzzle"]),
    "scene_complete_corridor": event("m1_corridor_question", ["m1_corridor_question", "m1_corridor_wrong", "m1_corridor_correct"]),
    "scene_entry_front_chamber": event("m1_front_entry", ["m1_front_entry", "m1_front_zhou"]),
    "clue_front_chamber:female_musicians": event("m1_front_zhou", ["m1_front_zhou"]),
    "scene_complete_front_chamber": event("m1_front_method_question", ["m1_front_method_question", "m1_front_wrong", "m1_front_correct"]),
    "scene_entry_passage": event("m1_passage_entry", ["m1_passage_entry", "m1_passage_inscription"]),
    "clue_passage:inscription": event("m1_passage_inscription", ["m1_passage_inscription"]),
    "puzzle_mg_inscription_reading_complete": event("m1_passage_question", ["m1_passage_question", "m1_passage_wrong", "m1_passage_correct", "m1_passage_space"]),
    "scene_complete_passage": event("m1_passage_space", ["m1_passage_space"]),
    "scene_entry_rear_chamber": event("m1_rear_entry", ["m1_rear_entry", "m1_rear_bed"]),
    "clue_rear_chamber:rear_wall_overview": event("m1_rear_false_door", ["m1_rear_false_door"]),
    "clue_rear_chamber:bones_nails": event("m1_rear_bones", ["m1_rear_bones", "m1_rear_boundary"]),
    "puzzle_mg_rear_relic_position_complete": event("m1_rear_bones", ["m1_rear_bones", "m1_rear_boundary"]),
    "scene_complete_rear_chamber": event("m1_rear_question", ["m1_rear_question", "m1_rear_wrong", "m1_rear_correct", "relocation_clue", "relocation_observe", "relocation_question", "relocation_wrong", "relocation_correct", "relocation_note"]),
    "scene_complete_final_report": event("final_box", ["final_box", "final_postscript", "final_temple", "final_note", "epilogue", "epilogue_dialog", "epilogue_line", "disclaimer", "game_end"]),
}


def main() -> None:
    payload = {
        "version": "story-vn-20260620-dialogue-types",
        "speakerPortraits": PORTRAITS,
        "events": EVENTS,
        "nodes": build_nodes(),
    }
    output = "(() => {\n  window.M1_STORY_DATA = "
    output += json.dumps(payload, ensure_ascii=False, indent=2)
    output += ";\n})();\n"
    Path("data/story-vn.js").write_text(output, encoding="utf-8")
    print(f"wrote data/story-vn.js with {len(payload['nodes'])} nodes and {len(EVENTS)} events")


if __name__ == "__main__":
    main()

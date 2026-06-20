(() => {
  window.M1_STORY_DATA = {
  "version": "story-vn-20260620-dialogue-types",
  "speakerPortraits": {
    "来人": "assets/story/portraits/周淼.png",
    "周淼": "assets/story/portraits/周淼.png",
    "苏池": "assets/story/portraits/苏池.png",
    "粟柏年": "assets/story/portraits/粟柏年.png",
    "陈怀远": "assets/story/portraits/陈怀远.png",
    "赵老倔": "assets/story/portraits/赵老倔.png",
    "赵广田": "assets/story/portraits/赵老倔.png",
    "民工老张": "assets/story/portraits/赵老倔.png",
    "常福来": "assets/story/portraits/赵老倔.png",
    "考古领队": "assets/story/portraits/粟柏年.png",
    "记录员": "assets/story/portraits/周淼.png",
    "考古队员": "assets/story/portraits/周淼.png",
    "考古技工": "assets/story/portraits/陈怀远.png"
  },
  "events": {
    "opening": {
      "start": "start",
      "nodes": [
        "start",
        "arrive",
        "meet_su",
        "su_intro",
        "zhou_hello",
        "ask_time",
        "insist_time",
        "go_to_site",
        "meet_su_teacher",
        "question_1",
        "wrong_answer",
        "correct_answer",
        "correct_answer_force",
        "teacher_intro",
        "teacher_say"
      ]
    },
    "scene_entry_environment": {
      "start": "m1_environment_entry",
      "nodes": [
        "m1_environment_entry",
        "m1_environment_task"
      ]
    },
    "scene_complete_environment": {
      "start": "m1_environment_complete",
      "nodes": [
        "m1_environment_complete",
        "m1_environment_complete_zhou"
      ]
    },
    "scene_entry_tomb_gate": {
      "start": "chapter1",
      "nodes": [
        "chapter1",
        "brick_wall"
      ]
    },
    "clue_tomb_gate:brick_seam": {
      "start": "find_crack",
      "nodes": [
        "find_crack",
        "crack_decision",
        "wrong_decision",
        "wrong_decision_end",
        "correct_decision",
        "after_correct"
      ]
    },
    "clue_tomb_gate:lintel_back": {
      "start": "m1_gate_lintel_back",
      "nodes": [
        "m1_gate_lintel_back",
        "m1_gate_lintel_zhou"
      ]
    },
    "puzzle_mg_dig_match3_complete": {
      "start": "door_reveal",
      "nodes": [
        "door_reveal"
      ]
    },
    "scene_complete_tomb_gate": {
      "start": "door_examined",
      "nodes": [
        "door_examined",
        "discover_second_tomb",
        "su_response"
      ]
    },
    "scene_entry_corridor": {
      "start": "m1_corridor_entry",
      "nodes": [
        "m1_corridor_entry",
        "m1_corridor_method"
      ]
    },
    "clue_corridor:corridor_roof": {
      "start": "m1_corridor_method",
      "nodes": [
        "m1_corridor_method"
      ]
    },
    "puzzle_corridor_pattern_align_complete": {
      "start": "m1_corridor_after_puzzle",
      "nodes": [
        "m1_corridor_after_puzzle"
      ]
    },
    "scene_complete_corridor": {
      "start": "m1_corridor_question",
      "nodes": [
        "m1_corridor_question",
        "m1_corridor_wrong",
        "m1_corridor_correct"
      ]
    },
    "scene_entry_front_chamber": {
      "start": "m1_front_entry",
      "nodes": [
        "m1_front_entry",
        "m1_front_zhou"
      ]
    },
    "clue_front_chamber:female_musicians": {
      "start": "m1_front_zhou",
      "nodes": [
        "m1_front_zhou"
      ]
    },
    "scene_complete_front_chamber": {
      "start": "m1_front_method_question",
      "nodes": [
        "m1_front_method_question",
        "m1_front_wrong",
        "m1_front_correct"
      ]
    },
    "scene_entry_passage": {
      "start": "m1_passage_entry",
      "nodes": [
        "m1_passage_entry",
        "m1_passage_inscription"
      ]
    },
    "clue_passage:inscription": {
      "start": "m1_passage_inscription",
      "nodes": [
        "m1_passage_inscription"
      ]
    },
    "puzzle_mg_inscription_reading_complete": {
      "start": "m1_passage_question",
      "nodes": [
        "m1_passage_question",
        "m1_passage_wrong",
        "m1_passage_correct",
        "m1_passage_space"
      ]
    },
    "scene_complete_passage": {
      "start": "m1_passage_space",
      "nodes": [
        "m1_passage_space"
      ]
    },
    "scene_entry_rear_chamber": {
      "start": "m1_rear_entry",
      "nodes": [
        "m1_rear_entry",
        "m1_rear_bed"
      ]
    },
    "clue_rear_chamber:rear_wall_overview": {
      "start": "m1_rear_false_door",
      "nodes": [
        "m1_rear_false_door"
      ]
    },
    "clue_rear_chamber:bones_nails": {
      "start": "m1_rear_bones",
      "nodes": [
        "m1_rear_bones",
        "m1_rear_boundary"
      ]
    },
    "puzzle_mg_rear_relic_position_complete": {
      "start": "m1_rear_bones",
      "nodes": [
        "m1_rear_bones",
        "m1_rear_boundary"
      ]
    },
    "scene_complete_rear_chamber": {
      "start": "m1_rear_question",
      "nodes": [
        "m1_rear_question",
        "m1_rear_wrong",
        "m1_rear_correct",
        "relocation_clue",
        "relocation_observe",
        "relocation_question",
        "relocation_wrong",
        "relocation_correct",
        "relocation_note"
      ]
    },
    "scene_complete_final_report": {
      "start": "final_box",
      "nodes": [
        "final_box",
        "final_postscript",
        "final_temple",
        "final_note",
        "epilogue",
        "epilogue_dialog",
        "epilogue_line",
        "disclaimer",
        "game_end"
      ]
    }
  },
  "nodes": {
    "start": {
      "id": "start",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你坐了六个小时的卡车，又在驴车上颠了两个钟头，才在一片铅灰色的冬日天空下，望见了几棵老槐树掩映的土房。\n\n河南，禹县，白沙镇。\n\n一个在地图上几乎找不到名字的地方，可你的外祖父来过。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "arrive",
      "puzzle": null
    },
    "arrive": {
      "id": "arrive",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "十二月的华北平原，风裹着干燥的尘土扑面而来。你下意识地紧了紧灰蓝列宁装的领口，手指碰到了一根细细的皮绳。\n\n皮绳上系着一枚银怀表链扣。圆形，比铜钱略大，银质表面布满了细密的裂纹。那是外祖父的遗物。",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [],
      "next": "meet_su",
      "puzzle": null
    },
    "meet_su": {
      "id": "meet_su",
      "kicker": "白沙手记",
      "speaker": "来人",
      "body": "“林同志？”",
      "backgroundImage": "assets/entrance.png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [
        {
          "text": "转过身",
          "next": "su_intro"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "su_intro": {
      "id": "su_intro",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "“我是苏池。粟老师说你今天到，让我来接一下。”\n\n他身后跟着一个拎画板的姑娘。\n\n“这位是周淼，测绘的。”",
      "backgroundImage": "assets/entrance.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [
        {
          "text": "“你好，辛苦了”",
          "next": "zhou_hello"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "zhou_hello": {
      "id": "zhou_hello",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "“林师姐！路上辛苦了！”\n\n她笑起来嘴角两个酒窝。",
      "backgroundImage": "assets/entrance.png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [
        {
          "text": "“明天什么时候开工？”",
          "next": "ask_time"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "ask_time": {
      "id": "ask_time",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "“粟老师在镇上供销社给你留了饭，让你今晚好好歇着，明天——”",
      "backgroundImage": "assets/entrance.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [
        {
          "text": "“明天什么时候开工？”",
          "next": "insist_time"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "insist_time": {
      "id": "insist_time",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "他愣了一下，“五点半。”",
      "backgroundImage": "assets/entrance.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [
        {
          "text": "“那麻烦你带我直接去工地吧。”",
          "next": "go_to_site"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "go_to_site": {
      "id": "go_to_site",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "缓坡顶上，你看见了那片隆起的高地。",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": null,
      "choices": [],
      "next": "meet_su_teacher",
      "puzzle": null
    },
    "meet_su_teacher": {
      "id": "meet_su_teacher",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "一个瘦高的身影正蹲在土台边上，手电光在暮色里晃。他穿了一身洗得发白的蓝布中山装，背对着你，正用放大镜一寸一寸地看着什么。",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": null,
      "choices": [],
      "next": "question_1",
      "puzzle": null
    },
    "question_1": {
      "id": "question_1",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“路上看见那条干河道了吗？”",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "东北-西南",
          "next": "wrong_answer"
        },
        {
          "text": "西北-东南",
          "next": "correct_answer"
        },
        {
          "text": "东南-西北",
          "next": "wrong_answer"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "wrong_answer": {
      "id": "wrong_answer",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "他微不可见地皱了下眉头，摇摇头说：“地形勘测在考古过程中也是很重要的一步。那条干河道是西北到东南走向。”",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "correct_answer_force",
      "puzzle": null
    },
    "correct_answer": {
      "id": "correct_answer",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“嗯。”他终于站起来，转过身，“观察得很仔细。明天早上五点半，在这个位置，先看墓道。”",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "teacher_intro",
      "puzzle": null
    },
    "correct_answer_force": {
      "id": "correct_answer_force",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“观察得很仔细。明天早上五点半，在这个位置，先看墓道。”",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "teacher_intro",
      "puzzle": null
    },
    "teacher_intro": {
      "id": "teacher_intro",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你与他打了个照面。\n\n瘦而高，眼镜腿断过一次，用白胶布缠着。\n\n粟柏年，29岁，北大考古专业青年教师，也是你接下来的领队老师。",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": null,
      "choices": [],
      "next": "teacher_say",
      "puzzle": null
    },
    "teacher_say": {
      "id": "teacher_say",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“休息吧，”他温和道，“明天会很累。”",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "第一章：墓门清理",
          "next": "chapter1"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "chapter1": {
      "id": "chapter1",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "【第一章·封门砖】\n\n天蒙蒙亮。\n\n粟柏年已经蹲在墓道口了。墓道北偏东，长五米余，入口处的填土已经被清理干净，露出了一道青灰色的封门砖墙。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": null,
      "choices": [],
      "next": "brick_wall",
      "puzzle": null
    },
    "brick_wall": {
      "id": "brick_wall",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“你看封门砖的砌法。”他用手铲轻轻叩了叩砖面，“一顺一丁，砌三层。这是北宋中晚期的标准砌法。”",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "find_crack",
      "puzzle": null
    },
    "find_crack": {
      "id": "find_crack",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "外层拆到第七块的时候，你停了下来。\n\n手电光穿过横砖之间的灰缝，打在最里层卧丁砖的砖面上——一道细细的阴影斜在砖面上。\n\n不是灰缝。灰缝是直的。这道阴影是斜的，从砖的右上角延伸到左下角，是一道裂缝。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": null,
      "choices": [],
      "next": "crack_decision",
      "puzzle": null
    },
    "crack_decision": {
      "id": "crack_decision",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“继续拆，还是暂停？”他问你。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "❌ 继续拆，裂缝不大",
          "next": "wrong_decision"
        },
        {
          "text": "✅ 暂停，先架支撑",
          "next": "correct_decision"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "wrong_decision": {
      "id": "wrong_decision",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你犹豫了一下，说出自己的判断：“继续拆。”\n\n常福来继续撬下一块菱角牙子。铁钎插进砖缝，用力一扳，砖孔后面的裂缝忽然变宽了……\n\n你清清楚楚地看见那道裂缝从一毫米变成了将近三毫米，中间一小片砖屑掉下来。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": null,
      "choices": [],
      "next": "wrong_decision_end",
      "puzzle": null
    },
    "wrong_decision_end": {
      "id": "wrong_decision_end",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "他并没有责怪你，只是在那天的发掘记录末尾写了一行：\n\n“拆至外层第七砖，内层卧丁砖原裂缝扩展，疑因外层支撑减弱所致。后续已加撑。”\n\n你站在旁边，看见他写这行字的时候，笔尖按得比平时重。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "door_reveal",
      "puzzle": null
    },
    "correct_decision": {
      "id": "correct_decision",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你把判断告诉了粟柏年。他点了点头，转身朝外面喊：“常师傅，备两根立柱和一根过梁。架在过道北壁下面。”\n\n立柱架起来的时候，粟柏年又看了一眼那道裂缝，他什么都没说，但你听到他轻轻呼了一口气。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": null,
      "choices": [],
      "next": "after_correct",
      "puzzle": null
    },
    "after_correct": {
      "id": "after_correct",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "之后继续拆外层砖，裂缝没有扩大。内层那块卧丁砖被取下以后，你翻过来看，发现裂缝已经深入到砖厚的一半。\n\n它不是今天才裂的，它被外层和中层死死压住，压了九百年。",
      "backgroundImage": "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
      "portrait": null,
      "choices": [],
      "next": "door_reveal",
      "puzzle": null
    },
    "door_reveal": {
      "id": "door_reveal",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "封门砖被逐块取下，墓门缓缓显形。\n\n一座千年以前的门楼完好地立在眼前，仿木斗拱层层叠出，每一朵都有金粉勾边的余痕。\n\n粟柏年压低了声音：“别急着进去，先把墓门各处看清楚——门额、砖缝、墓道、门洞，按顺序记下来。”",
      "backgroundImage": "assets/door.png",
      "portrait": null,
      "choices": [
        {
          "text": "举起手电，靠近墓门",
          "next": "tomb_gate_puzzle"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "tomb_gate_puzzle": {
      "id": "tomb_gate_puzzle",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "（操作提示：点击墓门上的不同位置进行观察。需记录“门额背面彩画”并累计至少 3 条记录，方可由门洞深处进入甬道。）",
      "backgroundImage": "assets/door.png",
      "portrait": null,
      "choices": [],
      "next": null,
      "puzzle": "tomb_gate"
    },
    "door_examined": {
      "id": "door_examined",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你把刚才的观察一条条记在田野笔记上。\n\n门额背面那幅卷草纹彩画——本不该出现在外人看得见的位置。门额正面题着墓主信息，背面却藏着完整的彩绘，这本身就是一处反常。\n\n粟柏年凑过来看你的笔记，沉默了几秒，只说了一句：“记下来，先不下结论。”",
      "backgroundImage": "assets/door.png",
      "portrait": null,
      "choices": [],
      "next": "discover_second_tomb",
      "puzzle": null
    },
    "discover_second_tomb": {
      "id": "discover_second_tomb",
      "kicker": "白沙手记",
      "speaker": "民工老张",
      "body": "“粟队长！北边又顶出来一个砖顶子！”",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": "assets/story/portraits/赵老倔.png",
      "choices": [],
      "next": "su_response",
      "puzzle": null
    },
    "su_response": {
      "id": "su_response",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“多远？”\n\n“二十来米，西北。”\n\n他回头看了一眼正在测绘的墓门，“先把顶砖回封，浮土盖回去，做个标记。今天所有人还在一号墓上。另一座要等这边的档期。”",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "tomb_open",
      "puzzle": null
    },
    "tomb_open": {
      "id": "tomb_open",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "墓室终于被打开了。\n\n手电光束扫过穹窿顶上的彩画，然后落在四壁。\n\n所有人都被眼前的景象震撼到。",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
      "portrait": null,
      "choices": [],
      "next": "north_wall",
      "puzzle": null
    },
    "north_wall": {
      "id": "north_wall",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你举着灯靠近北壁。\n\n夫妇对坐图。男子面容饱满，戴幞头，穿圆领袍。女子梳高髻，着对襟褙子。两人袖手而坐。桌上有酒壶、经瓶、台盏。\n\n身后各有一扇屏风，屏风上绘着山水。\n\n但你的注意力不在人像上。\n\n在屏风。",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [],
      "next": "hidden_text",
      "puzzle": null
    },
    "hidden_text": {
      "id": "hidden_text",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你贴近屏风，在侧光下逐段辨读。\n\n裂隙间隐约透出连续的文字，但被千年的颜料覆盖……",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [
        {
          "text": "仔细辨认",
          "next": "decipher_text"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "decipher_text": {
      "id": "decipher_text",
      "kicker": "白沙手记",
      "speaker": "你",
      "body": "崇宁四年秋……颖水泛溢……民饥……\n\n三千石以济……不敢使人知……\n\n天可鉴……不可传……\n\n后人知……赵怀诚",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [],
      "next": "hidden_meaning",
      "puzzle": null
    },
    "hidden_meaning": {
      "id": "hidden_meaning",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "屏风山水画中隐藏的文字，可辨内容：\n\n“崇宁四年秋，颖水泛溢，民饥……三千石以济……不敢使人知”\n\n赵怀诚——应当就是墓主赵大翁的本名。\n他做了某件事，不敢让人知道。",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [
        {
          "text": "继续探索墓室",
          "next": "find_bronze"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "find_bronze": {
      "id": "find_bronze",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "墓室西北角的方砖下，有一处空心。\n\n砖被揭开以后，露出一口长方形的小室，一尺见方，三寸深。室内放着一只铜筒，两端密封，蜡封完整。",
      "backgroundImage": "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
      "portrait": null,
      "choices": [],
      "next": "open_bronze",
      "puzzle": null
    },
    "open_bronze": {
      "id": "open_bronze",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“你来释读。”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "小心展开绢帛",
          "next": "read_silk"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "read_silk": {
      "id": "read_silk",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你接过绢帛。侧光下，墨迹清晰工整。\n\n“怀诚谨记：余十六起家，三十成业……崇宁四年一事，耿耿于怀……”\n\n绢帛下端三处被水渍浸染，残缺难辨。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": null,
      "choices": [
        {
          "text": "补全残缺文字",
          "next": "complete_text"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "complete_text": {
      "id": "complete_text",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "经过反复辨认，你逐步补全了残缺的文字：\n\n“饥民鬻儿卖女”\n“府库之粮，皆在簿册，私动一粒即斩”\n“本官今夜酒醉，不省人事”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": null,
      "choices": [],
      "next": "full_text",
      "puzzle": null
    },
    "full_text": {
      "id": "full_text",
      "kicker": "白沙手记",
      "speaker": "赵怀诚",
      "body": "“余遂以李公手谕，开府库，调三千石粮。又以自家粮米抵还府库。此事惟余与李公二人知情，迄今二十载……\n\n今将此绢藏于暗格，留待后人评说。知我罪我，惟待后人。”\n\n崇宁五年腊月 赵怀诚泣血谨记",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": null,
      "choices": [],
      "next": "ending",
      "puzzle": null
    },
    "ending": {
      "id": "ending",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "墓室里安静了很久。\n\n常福来蹲在角落里抽旱烟，吐出一口烟，打破沉默：“这是个好人。”\n\n粟柏年没有接话。你也没有。\n\n不是不想说。是你说不出来。\n\n那个秘密藏在屏风画里，藏在暗格铜筒里，藏了九百多年。\n\n终于被人读到了。",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [],
      "next": "relocation_clue",
      "puzzle": null
    },
    "relocation_clue": {
      "id": "relocation_clue",
      "kicker": "白沙手记",
      "speaker": "常福来",
      "body": "“林同志，你过来看看这骨头。”\n\n后室砖床上有一层朽木的痕迹，勾出了棺材的轮廓。你用皮尺量了铁钉之间的最大范围——长约一米八，宽约七十公分。\n\n这个尺寸，放两具完整的成人遗体太勉强了。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/赵老倔.png",
      "choices": [],
      "next": "relocation_observe",
      "puzzle": null
    },
    "relocation_observe": {
      "id": "relocation_observe",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "棺内两具骨架。头骨摆放还算整齐，但身体部分的骨骼混堆在头骨东侧。小骨片散乱重叠，像是被集中堆放进去的。\n\n你用放大镜检查了一块足骨的断面——断口干净，没有火烧痕迹，也没有近期被翻动的新鲜断面。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": null,
      "choices": [],
      "next": "relocation_question",
      "puzzle": null
    },
    "relocation_question": {
      "id": "relocation_question",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“你怎么看？\n\n骨骼为什么会这样混堆？”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "A. 被火烧过，骨殖散乱",
          "next": "relocation_wrong"
        },
        {
          "text": "B. 墓被盗扰，盗墓者翻乱了",
          "next": "relocation_wrong"
        },
        {
          "text": "C. 原葬于别处，后迁葬至此",
          "next": "relocation_correct"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "relocation_wrong": {
      "id": "relocation_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "他摇了摇头。\n\n“断口没有火烧的炭化层，也没有近期翻动的新鲜茬口。封门砖砌得是死的，盗洞也找不到。\n\n再想想——头骨整齐，身骨混堆。这是被人特意按某种方式放进去的。”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "relocation_correct",
      "puzzle": null
    },
    "relocation_correct": {
      "id": "relocation_correct",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "迁葬。\n\n二次葬。头骨被特意安放，身体骨骼集中堆置。棺材不需要太大——放的只是骨骸，不是遗体。\n\n你忽然想到一个问题。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": null,
      "choices": [],
      "next": "relocation_note",
      "puzzle": null
    },
    "relocation_note": {
      "id": "relocation_note",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "一号墓建于元符二年——1099 年。\n但绢帛的落款是崇宁五年——1106 年。\n\n赵怀诚在 1106 年还活着——他在那一年冬天写下了绢帛。\n\n那 1099 年这个墓里葬的是谁？\n\n你把这个问题写在笔记里，画了一个圈。家谱或可解答——但家谱在哪里？",
      "backgroundImage": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
      "portrait": null,
      "choices": [
        {
          "text": "合上笔记，去前室复核临摹稿",
          "next": "travel1_trigger"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "travel1_trigger": {
      "id": "travel1_trigger",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "一号墓的测绘和清理在 12 月 31 日中午全部完成。下午一部分人去西北面接着挖二号墓。\n\n你的任务是协助周淼复核一号墓壁画临摹稿。前室的临摹稿已经完成大半，你正对照北壁夫妇对坐图检查轮廓——\n\n手指不小心碰到脖子上挂的银怀表链扣。\n\n它忽然变得温热。",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_dorm",
      "puzzle": null
    },
    "travel1_dorm": {
      "id": "travel1_dorm",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "傍晚。驻地宿舍。\n\n你从行李箱最底层翻出一个蓝布小包，里面是另外两件外祖父的遗物——一枚铜扣，一把铜钥匙。\n\n铜扣的形状和你的银扣几乎一样：圆形，比铜钱略大。表面布满绿锈，裂纹密布。手稿里夹着一张毛边纸——\n\n民国二十六年十月，白沙。\n外祖父林霁春写：“此扣与银扣同出白沙土中，或为一器之分，暂收以待来日。”",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_fit",
      "puzzle": null
    },
    "travel1_fit": {
      "id": "travel1_fit",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你试着把两枚扣子放在一起。\n\n严丝合缝——凹凸对应，像锁和钥匙。\n\n铜扣在你手心里忽然烫了一下。指尖碰到的那几道裂纹正在缓慢发光，柔和的，琥珀色的。\n\n窗外那棵老槐树的影子在风里晃了一下。一股焚烧稻草和尘土的气味涌过来——不是从窗外。\n\n树叶忽然不再沙沙响了。周围的声音在消失。你的视野开始变窄。",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_handsbody",
      "puzzle": null
    },
    "travel1_handsbody": {
      "id": "travel1_handsbody",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你低头看自己的手——手指正在变得粗糙，关节粗大，皮肤上爬满褶皱和旧的茧。\n\n这不是你的手。\n\n抬起头，老槐树不见了。取而代之的是一棵更老更粗的槐树。牛车正从外面的土路上碾过去，牛铃叮叮当当。\n\n膝盖撞到了一张账房的老木桌。砚台里还汪着半干的墨。\n\n账本封面写着：“赵氏粮行日用流水，大观二年”。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_open_warehouse",
      "puzzle": null
    },
    "travel1_open_warehouse": {
      "id": "travel1_open_warehouse",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "【你不能动。你只是困在这具身体里，透过他的眼睛看。】\n\n崇宁四年的秋天。颖河堤已经在三天前溃了。\n\n你——赵怀诚——站在自家粮铺门口。街面上挤满逃难的人。一个女人蹲在墙角，怀里搂着个婴儿，婴儿哭声已经哑了。\n\n你看见赵怀诚转过身：“开仓。”\n\n赵家粮铺过去五年的存粮，两天就见了底。第三天，算盘珠子在指节下排出一个数字——三千石。\n\n不够。",
      "backgroundImage": "assets/M1/06_前室_南壁/第一号墓前室南壁壁画.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_state_office",
      "puzzle": null
    },
    "travel1_state_office": {
      "id": "travel1_state_office",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "州府衙门侧门的灯笼在夜风里晃。\n\n知州李明辅坐在灯下，面前摊着府库的粮册。赵怀诚在他对面坐下，没有说话。",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_li_dialogue",
      "puzzle": null
    },
    "travel1_li_dialogue": {
      "id": "travel1_li_dialogue",
      "kicker": "白沙手记",
      "speaker": "李明辅",
      "body": "“府库里的粮，都在簿册上。\n\n私动一粒，就是死罪。”",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_zhao_reply",
      "puzzle": null
    },
    "travel1_zhao_reply": {
      "id": "travel1_zhao_reply",
      "kicker": "白沙手记",
      "speaker": "赵怀诚",
      "body": "“李公若是不知，便是怀诚自己取的。\n\n三千石，都算在怀诚头上。”",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_li_drunk",
      "puzzle": null
    },
    "travel1_li_drunk": {
      "id": "travel1_li_drunk",
      "kicker": "白沙手记",
      "speaker": "李明辅",
      "body": "沉默了很长时间。然后他站起来，走到窗边，把窗户推开一条缝。冷风灌进来，吹得灯焰几乎灭了。\n\n“本官今夜酒醉，不省人事。”",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_oldman",
      "puzzle": null
    },
    "travel1_oldman": {
      "id": "travel1_oldman",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "门在身后关上的时候，你感觉到赵怀诚在台阶上站了一会儿。\n\n一个守门的老衙役看了他一眼。老衙役什么都没说，只是把侧门的门闩拉开了——那扇门白天从来不开。然后他转过身，面对着墙，假装什么都没有看见。\n\n火把的光晃了一下。赵怀诚朝官仓走去。\n\n你感觉到他眼眶里有什么东西涌上来。不是泪，是某种比泪更烫的东西。",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁东部.png",
      "portrait": null,
      "choices": [],
      "next": "travel1_back",
      "puzzle": null
    },
    "travel1_back": {
      "id": "travel1_back",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "铜扣在你手心里冷却。\n\n窗外的槐树长得很高了，是 1951 年冬夜的秃枝。\n\n你慢慢地吐出一口气。手还在抖。低头看自己的手指——细细的，没有老茧。\n\n刚才不是你在动，是你在看着。\n\n赵怀诚站在州府门口的那个背影，好像还在你眼皮子底下站着。脑子里只有一个念头——这个“赵大翁”，根本不是什么善人。他是一个差点掉了脑袋的罪人。\n\n他自己守着这个秘密，守到死。",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [
        {
          "text": "把铜扣挂在银扣旁边",
          "next": "travel1_endnote"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "travel1_endnote": {
      "id": "travel1_endnote",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你把铜扣挂在了银扣旁边。两枚扣子挨在一起，碰撞时发出一声极轻的响，像锁簧归位。\n\n明天。\n\n明天要开二号墓。",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [
        {
          "text": "第二章：二号墓",
          "next": "chapter2"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "chapter2": {
      "id": "chapter2",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "1952 年 1 月 1 日。新年没有任何仪式，工地照常开工。\n\n二号墓位于一号墓西北约二十米。封门砖比一号墓更整齐，砖缝灌着白灰。粟柏年判断：墓主身份高于一号墓主。\n\n一天后，墓门打开。",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": null,
      "choices": [],
      "next": "chapter2_enter",
      "puzzle": null
    },
    "chapter2_enter": {
      "id": "chapter2_enter",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "二号墓为单室仿木结构砖室墓。墓室呈八角形，斗拱繁复，远胜一号墓。\n\n西南壁——一幅地图。墨线勾出山川，标注六个地名：白沙、汜水、洛阳、太原、忻州、雁门。\n\n一条细朱线，从白沙北上，止于雁门。",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
      "portrait": null,
      "choices": [],
      "next": "chapter2_ledger",
      "puzzle": null
    },
    "chapter2_ledger": {
      "id": "chapter2_ledger",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "棺床下方暗格里，发现一卷麻纸账本。封面无字。\n\n粟柏年用稀释的明矾水刷过——隐墨显形。\n\n大观元年至三年间的流水：粮、盐、铁、马蹄铁、皮甲衬里。其中四十二条注明“北行”，目的地皆为雁门。",
      "backgroundImage": "assets/front-west.png",
      "portrait": null,
      "choices": [],
      "next": "chapter2_puzzle_supply",
      "puzzle": null
    },
    "chapter2_puzzle_supply": {
      "id": "chapter2_puzzle_supply",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“四十二条北行记录，都是马蹄铁、皮甲衬里、咸盐、糙米这类东西。\n\n你说，这些是运给谁的？”",
      "backgroundImage": "assets/front-west.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "A. 北方亲戚的日常贴补",
          "next": "chapter2_supply_wrong"
        },
        {
          "text": "B. 边军军需",
          "next": "chapter2_supply_correct"
        },
        {
          "text": "C. 普通边境互市贸易",
          "next": "chapter2_supply_wrong"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "chapter2_supply_wrong": {
      "id": "chapter2_supply_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“数额对不上。马蹄铁单条就上千副，皮甲衬里成捆——\n\n这是装备一支军队的量。况且大观年间，朝廷管控边境铁器极严。”",
      "backgroundImage": "assets/front-west.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "chapter2_supply_correct",
      "puzzle": null
    },
    "chapter2_supply_correct": {
      "id": "chapter2_supply_correct",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "军需。\n\n账本扉页背面，露出一行更细的字：“枢密院丁字号信牌为凭”。\n\n暗格深处又取出一枚铜质信牌，边缘刻着反切符号。粟柏年熬了一夜，反切对出四个字——\n\n“便宜行事”。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": null,
      "choices": [],
      "next": "chapter2_zhongan",
      "puzzle": null
    },
    "chapter2_zhongan": {
      "id": "chapter2_zhongan",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "赵仲安——赵怀诚之子。大观年间领枢密院密令，主持“北行”军需，为雁门防线输送物资。\n\n这不是一个商人的墓。这是一个为帝国边防偷偷输血的人的墓。\n\n夜里，铜扣再度发热。",
      "backgroundImage": "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁.png",
      "portrait": null,
      "choices": [
        {
          "text": "接受第二次穿越",
          "next": "travel2_open"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "travel2_open": {
      "id": "travel2_open",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "账房。烛火。账本摊开。\n\n你——赵仲安——握着笔，手却在抖。窗外有马蹄声远远过去。\n\n门帘被掀开，进来的是妻子刘氏。她接过笔，蘸墨，落字稳如磐石。\n\n“你写不下去的字，我替你写。”",
      "backgroundImage": "assets/front-west.png",
      "portrait": null,
      "choices": [],
      "next": "travel2_liu",
      "puzzle": null
    },
    "travel2_liu": {
      "id": "travel2_liu",
      "kicker": "白沙手记",
      "speaker": "刘氏",
      "body": "“典田的契书我已经画了押。城东三十亩，给王老爹；城南二十亩，给周屠户家。\n\n这个月北边再要一批马蹄铁，缺的钱，从这里出。”",
      "backgroundImage": "assets/front-west.png",
      "portrait": null,
      "choices": [],
      "next": "travel2_warn",
      "puzzle": null
    },
    "travel2_warn": {
      "id": "travel2_warn",
      "kicker": "白沙手记",
      "speaker": "赵仲安",
      "body": "“信牌不能留在家里。\n\n把信牌藏到墓里去——壁画后面。等我死了，跟我一起埋了。\n\n这条命，是替朝廷扛着的。命没了，证据也得跟着没。”",
      "backgroundImage": "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
      "portrait": null,
      "choices": [],
      "next": "travel2_back",
      "puzzle": null
    },
    "travel2_back": {
      "id": "travel2_back",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "铜扣冷却。\n\n你回到 1952 年 1 月 3 日深夜。手里的铅笔尖断了。\n\n你忽然明白：二号墓壁画后面那个暗格——不是临时起意，是他生前就规划好的。\n\n一个把朝廷的秘密带进坟墓的人。",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [
        {
          "text": "第三章：三号墓",
          "next": "chapter3"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "chapter3": {
      "id": "chapter3",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "1952 年 1 月 4 日。三号墓位于一、二号墓之间稍偏南，规模最小，封土几乎被犁平。\n\n墓门粗糙，封门砖大小不一，有几块明显是从别处拆来的旧砖。\n\n墓室内壁无画，只有素面白灰。棺床上一具骨架，无棺。",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": null,
      "choices": [],
      "next": "chapter3_bones",
      "puzzle": null
    },
    "chapter3_bones": {
      "id": "chapter3_bones",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "骨架为女性，约四十至五十岁。\n\n左肩胛骨有一处明显增厚的骨痂——一枚锈蚀的铁箭头嵌在其中，方向自前向后。\n\n创口边缘的骨质增生表明：这枚箭，是箭主自己扎进去的，并且带伤生活了至少十年以上。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": null,
      "choices": [],
      "next": "chapter3_puzzle_zhang",
      "puzzle": null
    },
    "chapter3_puzzle_zhang": {
      "id": "chapter3_puzzle_zhang",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“前向后入骨，箭尾朝前。这不是被射中。\n\n这是自己扎进去的。\n\n一个女人，为什么要把箭头扎进自己的肩膀，并且带着它活了十几年？”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "A. 战乱中误伤",
          "next": "chapter3_zhang_wrong"
        },
        {
          "text": "B. 自伤——为了把某样东西藏在伤口里",
          "next": "chapter3_zhang_right"
        },
        {
          "text": "C. 民间巫术",
          "next": "chapter3_zhang_wrong"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "chapter3_zhang_wrong": {
      "id": "chapter3_zhang_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“误伤的话，箭一般会被取出来。带伤十年——这枚箭是她不让别人取出来的。\n\n再想想，她为什么要藏？”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "chapter3_zhang_right",
      "puzzle": null
    },
    "chapter3_zhang_right": {
      "id": "chapter3_zhang_right",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "箭头是个伪装。\n\n肩膀里塞着的，可能是一份要命的东西。靖康元年金兵南下，赵季平战死无棺，妻张氏只身南归——\n\n她在自己肩膀里藏了什么？\n\n墓中无符节、无文书。只有那枚锈蚀的铁箭头，和一具骨架。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": null,
      "choices": [],
      "next": "chapter3_guanyu",
      "puzzle": null
    },
    "chapter3_guanyu": {
      "id": "chapter3_guanyu",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“一、二、三号墓的位置——一号最南，二号西北，三号中间偏南。\n\n这是贯鱼葬。父在前，子在后，孙更后，南为尊。\n\n所以——”",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "一号墓主辈分最高",
          "next": "chapter3_guanyu_right"
        },
        {
          "text": "三号墓主辈分最高",
          "next": "chapter3_guanyu_wrong"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "chapter3_guanyu_wrong": {
      "id": "chapter3_guanyu_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "“反了。贯鱼葬南为尊，最南最尊。一号墓最南——是祖父辈。”",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "chapter3_guanyu_right",
      "puzzle": null
    },
    "chapter3_guanyu_right": {
      "id": "chapter3_guanyu_right",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "一号：赵怀诚。\n二号：赵仲安（怀诚之子）。\n三号：应为仲安之子——赵季平。\n\n但三号墓里只葬着一个女人。男主人去了哪里？",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
      "portrait": null,
      "choices": [],
      "next": "chapter3_field",
      "puzzle": null
    },
    "chapter3_field": {
      "id": "chapter3_field",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "1 月 10 日。地表踏勘。\n\n三座墓所在的台地南缘，散落瓷片三层：上层粗陶，中层青白瓷，最下层细白瓷。瓷质从精到粗，时代从早到晚。\n\n聚落在三代之内迅速衰微。\n\n台地东侧有一道下凹的旧河道，走向西北—东南。古河水曾从台地脚下流过，后来改道、干涸。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "chapter3_slip",
      "puzzle": null
    },
    "chapter3_slip": {
      "id": "chapter3_slip",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你站在台地北面那棵半枯的老柏树下。\n\n粟柏年问：“这棵柏树有什么讲究？”\n\n你听见自己脱口而出——\n\n“北七步，柏树底下。”\n\n说完之后，你自己也愣住了。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "chapter3_sushi",
      "puzzle": null
    },
    "chapter3_sushi": {
      "id": "chapter3_sushi",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "夜里，他端着搪瓷缸子坐在你对面。\n\n“小林，墓里湿度高，真菌感染容易引起短时幻觉。\n\n田野工作做得越深，越容易把自己代入进去。我见过比你严重的——最优秀的田野工作者，都有过这种‘职业幻觉’。\n\n我不追问你看见了什么。我只想说，明天白天，我们再去北面那棵柏树底下，做一次正式的探沟。\n\n是真是假，铲子说了算。”",
      "backgroundImage": "assets/entrance.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "接受第三次穿越",
          "next": "travel3_open"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "travel3_open": {
      "id": "travel3_open",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "那天夜里，铜扣最后一次发热。\n\n这一次，你不是赵家任何一个人。\n\n你是一个无名的老妇人，蹲在土地庙后头，膝盖陷在湿冷的黄泥里。\n\n靖康二年的春天。金兵已经过了黄河。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "travel3_pickup",
      "puzzle": null
    },
    "travel3_pickup": {
      "id": "travel3_pickup",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "你看见地上躺着一个女人。她的左肩上插着一支断箭，箭头深陷在骨头里。她已经死了。\n\n她怀里掉出来一卷东西——一截铜符节，缠着染血的麻布。\n\n你伸出粗糙的、爬满褶皱的手，把符节捡起来。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "travel3_hide",
      "puzzle": null
    },
    "travel3_hide": {
      "id": "travel3_hide",
      "kicker": "白沙手记",
      "speaker": "老妇人",
      "body": "“这个不能让金兵见着。”\n\n你走进土地庙。神像底座有一道裂缝。你把符节裹紧，塞了进去，又用泥糊死。\n\n出庙的时候，你回头看了那女人一眼。\n\n“好闺女，你把命搭上的东西，俺给你藏好了。”",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "travel3_back",
      "puzzle": null
    },
    "travel3_back": {
      "id": "travel3_back",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "铜扣再没有热过。\n\n你回到 1 月 14 日的清晨。粟柏年带着两个民工已经站在北面那棵老柏树下了。\n\n探沟挖到第七步、约两米深的地方，铲子碰到一个东西——",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
      "portrait": null,
      "choices": [],
      "next": "final_box",
      "puzzle": null
    },
    "final_box": {
      "id": "final_box",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "一只锈蚀严重的铁匣。匣中有一卷麻纸家谱，并附后记数页。\n\n家谱起首四代：\n　赵远——北宋军户，靖康前殁，遗训：“当兵的要帮，逃荒的也要帮。”\n　赵怀诚——元符二年迁葬其父远于此，崇宁四年开仓三千石。\n　赵仲安——大观年间承枢密院密令北行军需，雁门防线。\n　赵季平——靖康元年战死无棺；妻张氏南归，自伤左肩护符节。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": null,
      "choices": [],
      "next": "final_postscript",
      "puzzle": null
    },
    "final_postscript": {
      "id": "final_postscript",
      "kicker": "白沙手记",
      "speaker": "张氏后记",
      "body": "末页是张氏的字，墨色已经发褐：\n\n　“汝以身护符，吾以箭护汝，虽阴阳两隔，此志不渝。”",
      "backgroundImage": "assets/M1/16_出土器物与人骨/地券.png",
      "portrait": null,
      "choices": [],
      "next": "final_temple",
      "puzzle": null
    },
    "final_temple": {
      "id": "final_temple",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "下午，按家谱线索，你们找到了村北那座早已荒废的土地庙。\n\n神像底座的裂缝里，还嵌着半截铜符节，上面有干涸的麻布拓痕。\n\n年代、形制，与二号墓铜信牌可对照。\n\n那个无名老妇人，把承诺守了八百多年。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": null,
      "choices": [],
      "next": "final_note",
      "puzzle": null
    },
    "final_note": {
      "id": "final_note",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "1952 年 3 月。报告初稿装订成册。\n\n粟柏年合上稿子，在最后一页右下角，用铅笔轻轻添了一行小字：\n\n　“见证者：林砚秋”\n\n他没有解释。你也没有问。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
      "portrait": null,
      "choices": [
        {
          "text": "2026 年秋",
          "next": "epilogue"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "epilogue": {
      "id": "epilogue",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "2026 年秋。北京。\n\n林砚秋——已经九十八岁——坐在窗下的藤椅里。孙女把一本新出的书放在她膝上：《白沙宋墓》纪念再版，封面素净。\n\n扉页上印着一行字：\n\n　“本故事纯属虚构。真实信息，以宿白先生《白沙宋墓》考古报告为准。”",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [],
      "next": "epilogue_dialog",
      "puzzle": null
    },
    "epilogue_dialog": {
      "id": "epilogue_dialog",
      "kicker": "白沙手记",
      "speaker": "孙女",
      "body": "“奶奶，那个赵家——他们存在过吗？”\n\n老人没有立刻回答。她用指腹摩挲着扉页那行字，很久。",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [],
      "next": "epilogue_line",
      "puzzle": null
    },
    "epilogue_line": {
      "id": "epilogue_line",
      "kicker": "白沙手记",
      "speaker": "林砚秋",
      "body": "“能被人记住，便是第二次活着。”",
      "backgroundImage": "assets/entrance.png",
      "portrait": null,
      "choices": [
        {
          "text": "声明",
          "next": "disclaimer"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "disclaimer": {
      "id": "disclaimer",
      "kicker": "白沙手记",
      "speaker": "声明",
      "body": "本故事中的人物、家族、墓主姓名、家谱、绢帛、信牌、符节、穿越情节，均为虚构。\n\n白沙宋墓为真实考古发掘项目。1951 年 12 月至 1952 年 1 月，由宿白先生主持发掘于河南禹县白沙镇。考古报告《白沙宋墓》由文物出版社于 1957 年初版，2002 年再版，是中国宋代考古的奠基之作。\n\n关于墓葬的形制、年代、壁画内容等真实信息，请以宿白先生原报告为准。\n\n谨以此作，致敬所有于田野中默默工作的考古人。",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [
        {
          "text": "完",
          "next": "game_end"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "game_end": {
      "id": "game_end",
      "kicker": "白沙手记",
      "speaker": "旁白",
      "body": "——完——",
      "backgroundImage": "assets/rear-north.png",
      "portrait": null,
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_environment_entry": {
      "id": "m1_environment_entry",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "天还没亮透，风从华北平原的枯槁田野上刮过来，像一把钝锯子在骨头缝里来回拉。你跟着粟柏年爬上缓坡，工地在暮色里显出轮廓：几片探方，几盏马灯，帆布棚子被风吹得哗哗响。\n\n粟柏年停在高地边缘，从口袋里掏出一张折叠整齐的坐标纸，在晨雾里抖开。纸上是白沙宋墓群的平面草图，几个墨点标出已探明的墓位，M1在最南端，靠近水库取土区的边缘。\n\n（粟柏年）\"先看大局。\"他把草图摊在一块平整的夯土断面上，用两块碎砖压住边角。你注意到图纸右上角还印着一行小字：\"白沙附近图\"，标出了白沙镇、禹县、颖水的相对位置，水库工程取土区用斜线阴影标出，M1就在那片阴影的边缘。\n\n（粟柏年）\"白沙镇在这个位置。\"铅笔尖点在图纸西南角，\"墓群坐落在这道南北向土岗的东坡，海拔比周围农田高出约十五米。东南高，西北低。土岗北侧那条干涸的河道——正是你昨天在卡车上看见的那条，西北到东南走向。M1是第一批暴露出来的，但未必是最早建的。\"",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_environment_task",
      "puzzle": null
    },
    "m1_environment_task": {
      "id": "m1_environment_task",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"待会儿你要进的是一座完整的墓。不是单个谜题，是一个从外到内的空间系统。每走一步，前面的发现都会重新被后面的证据检验。\"\n\n他把草图折好，塞回口袋，抬头看了你一眼。\n\n（粟柏年）\"现在，把白沙位置、墓群范围和这条空间序列标在你的记录本上。顺序别乱。\"",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_environment_complete": {
      "id": "m1_environment_complete",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "你凑过去。图纸上画着一道蜿蜒的虚线，从镇子边缘延伸过来，绕过一片洼地，攀上土岗。虚线旁边标了一行小字：\"1940年勘测路线\"。\n\n（你）\"这是……\"\n\n（粟柏年）\"你外祖父。1940年，他随历史所调查组来过白沙。这条线是他手绘的。\"他没看你，铅笔在M1的符号旁画了一条轴线，\"墓道→墓门→甬道→前室→过道→后室。六个节点，像一串被埋在地下的链扣。同一座墓，两代人。这不常见。\"\n\n你低头看着图纸。铅笔画的虚线很细，但在M1旁边有个顿笔，墨迹比其他地方略深——他在那个位置停了一下。\n\n手指碰到领口里的银扣，皮绳被体温焐得发软。",
      "backgroundImage": "assets/M1/01环境地图/白沙宋墓地形图.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_environment_complete_zhou",
      "puzzle": null
    },
    "m1_environment_complete_zhou": {
      "id": "m1_environment_complete_zhou",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "（周淼）\"这是我昨晚凭记忆画的。比例不准，但空间关系大致对。你带着，进墓的时候有个底。\"",
      "backgroundImage": "assets/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_gate_lintel_back": {
      "id": "m1_gate_lintel_back",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"正面是规矩，背面是自由。一座墓门，两面信息——'背面也有信息'，这是本次调查的第一个方法收获。这个意识你以后要养成——正面看完，必须想背面。\"\n\n周淼从你身后挤过来，举着速写本，仰头看了一会儿。",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓墓门(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_gate_lintel_zhou",
      "puzzle": null
    },
    "m1_gate_lintel_zhou": {
      "id": "m1_gate_lintel_zhou",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "你跨过门槛，站在他旁边。门额背面的砖面上，有一幅彩画。颜色已经褪了大半，但还能看出赭红色的云气纹和几点残留的石青色。线条是随手勾上去的，不像正面门额那样工整，却更自由。\n\n（粟柏年）\"正面是规矩，背面是自由。一座墓门，两面信息——'背面也有信息'，这是本次调查的第一个方法收获。这个意识你以后要养成——正面看完，必须想背面。\"",
      "backgroundImage": "assets/M1/02墓道与墓门/第一号墓墓门(彭华士摄).png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_corridor_entry": {
      "id": "m1_corridor_entry",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "手电光束从甬道顶部扫过。两扇版门通刷赭色，颜色沉得像凝固的血。每扇砌门钉七排，每排五钉，铁钉头在光下微微反光。门环一具，形制朴素，环面上有铸痕。版门下缘距地面留有不到两指宽的空间，是宋代\"断砌造\"的遗痕，门不落地，下面卧着门砧。\n\n顶部用横砖叠涩内收，一层一层向中心聚拢，每层砖都比下一层往内缩进几寸。最顶心画着赭黄二色的叠胜图案，两个菱形相叠，线条简洁。\n\n周淼站住了，仰头看了很久。她举起炭笔对着顶心比了比，自言自语般轻声说了句\"这个叠胜和《营造法式》里的罗纹叠胜比起来简化了不少，颜色保存得真好\"。说完又看了好一会儿，才低头往画板上勾线，手腕很轻。\n\n陈怀远从她身后走过去，用手电在顶部扫了一道。\n\n（陈怀远）\"三面叠涩，横砖收顶。八层。内收弧度比正常的缓。最下面两层叠涩的砖角磨得比上面圆，被人反复碰过。可能是下葬时抬棺，棺底蹭的。\"",
      "backgroundImage": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [],
      "next": "m1_corridor_method",
      "puzzle": null
    },
    "m1_corridor_method": {
      "id": "m1_corridor_method",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"别只往前走，抬头看顶部，侧看两壁。东壁绘有司阍——守门人——与手持贡品的侍者，人物排列呈迎接姿态，面向墓门方向；西壁同样绘有司阍，旁有马匹和捧酒壶的侍者，马匹朝向与东壁人物形成对位。两侧壁面共同构成'过渡与引导'的图像程序。甬道不是让你走的，是让你学会怎么看的。\"",
      "backgroundImage": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_corridor_after_puzzle": {
      "id": "m1_corridor_after_puzzle",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "（周淼）\"东壁司阍面向墓门，西壁马匹面向前室……两边都在把人往前推。\"",
      "backgroundImage": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_corridor_question": {
      "id": "m1_corridor_question",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "【选项】粟柏年为什么让你三面合读？",
      "backgroundImage": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "因为三面壁画合在一起才能看懂装饰主题",
          "next": "m1_corridor_wrong"
        },
        {
          "text": "因为顶部、两壁共同决定甬道的空间功能",
          "next": "m1_corridor_correct"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "m1_corridor_wrong": {
      "id": "m1_corridor_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "主题和对照都不是重点。重点是方法：进到一个封闭空间，先定位置，再看顶部，然后扫两侧壁。",
      "backgroundImage": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_corridor_correct",
      "puzzle": null
    },
    "m1_corridor_correct": {
      "id": "m1_corridor_correct",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"对。考古观察不是看画，是读空间。顶部给你方向，侧壁给你内容。三面合读，才能判断甬道是单纯的通道，还是在引导你进入前室。\"",
      "backgroundImage": "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_front_entry": {
      "id": "m1_front_entry",
      "kicker": "白沙手记",
      "speaker": "陈怀远",
      "body": "穿过甬道，前室豁然开朗。手电光先照到了穹窿顶上的扁方形宝盖式盝顶藻井。垂旒相间用赭、青、黄、白四色，盝顶坡面上画着柿蒂纹和覆莲，顶心是绛青二色的叠胜。藻井四角的弧线柔和而精准。\n\n陈怀远站在前室正中，仰头看着穹窿顶，手里皮卷尺的一端垂在地面。他量了量盝顶四角的弦长，在记录本上写了一串数字，然后后退半步，眯起一只眼，像木匠看梁是否端正。\n\n（陈怀远）\"四角起翘的弧度不一样。西北角比东南角缓了半寸。\"他顿了顿，\"不是匠人失手，是地基沉降。九百年，土往下走了。\"\n\n粟柏年的手电在顶心停了一下，缓缓下落，扫过四壁。",
      "backgroundImage": "assets/M1/06_前室_南壁/第一号墓前室南壁壁画.png",
      "portrait": "assets/story/portraits/陈怀远.png",
      "choices": [],
      "next": "m1_front_zhou",
      "puzzle": null
    },
    "m1_front_zhou": {
      "id": "m1_front_zhou",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "东壁是女乐图。卷帘下，女乐十一人分左右两组。右侧五人击鼓、击拍板、击腰鼓、吹横笛、吹觱篥。左侧五人吹箫、吹笙、吹十二管排箫、弹曲颈五弦琵琶。排箫下端系着同心结饰，绛蓝相间。四排乐人之间，一人戴硬脚花额幞头，欠身扬袖作舞。\n\n周淼站在东壁前，忘了手里的画板。她的嘴唇微微张着，杏仁眼里有光在跳。你顺着她的目光看过去，那个吹排箫的女乐梳高髻方额，髻上戴白团冠，冠下插簪饰，每一根绳股的走向都清清楚楚。\n\n她轻声说了一句，轻到你差点没听清。\n\n（周淼）\"这个绿……怎么调的。\"她把铅笔举到鼻尖前嗅了一下，松木味让她安定下来，\"石绿打底，上罩藤黄……不对，这层透亮，像加了蛤白。\"\n\n她把铅笔举到半空中，没有落笔，因为知道自己调不出这种颜色。你往旁边挪了一步，让她站得更靠近画面。她下意识闻了闻铅笔尖，松木味让她安定，闻到这个味道，她就知道自己在做该做的事。然后开始在画板上勾线，手腕很轻，像怕惊到什么。",
      "backgroundImage": "assets/M1/04_前室_东壁/第一号墓前室东壁壁画(原色版，彭华士摄).png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_front_method_question": {
      "id": "m1_front_method_question",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"前室不能只看最漂亮或最醒目的画面。人物、器物、入口和顶部结构要放在同一张复查表里。屏风上的细节，等全部壁面记录完再细看。\"\n\n你退后一步。那些墨线还在，但粟柏年说得对，现在不是追单个细节的时候。",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "因为漂亮画面更容易吸引视线",
          "next": "m1_front_wrong"
        },
        {
          "text": "因为前室结论来自人物、器物、入口和顶部的互相校验",
          "next": "m1_front_correct"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "m1_front_wrong": {
      "id": "m1_front_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "漂亮画面不能替你完成判断。前室要看人物、器物、入口和顶部是怎么同时组织起来的。",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_front_correct",
      "puzzle": null
    },
    "m1_front_correct": {
      "id": "m1_front_correct",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "对。前室成立的不是一张漂亮壁画，而是一套被组织过的礼仪空间。",
      "backgroundImage": "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_passage_entry": {
      "id": "m1_passage_entry",
      "kicker": "白沙手记",
      "speaker": "周淼",
      "body": "穿过前室南壁的短甬，空间忽然窄下来。墙壁从四面收拢，顶部的宝盖式盝顶变成更紧凑的丁字形收束。手电光在窄壁上投出长长的影子，像把人轻轻推向下一间屋子。\n\n（周淼）\"前室之后，空间忽然窄下来。尽头更暗。\"\n\n她下意识往你身后退了半步。",
      "backgroundImage": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
      "portrait": "assets/story/portraits/周淼.png",
      "choices": [],
      "next": "m1_passage_inscription",
      "puzzle": null
    },
    "m1_passage_inscription": {
      "id": "m1_passage_inscription",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "粟柏年的手电停在东壁。壁上有一行墨书，八个字，一笔一划，在赭红色的底色上显得格外清晰。\n\n\"元符二年赵大翁布。\"\n\n粟柏年把手电的光斑定在那行字上，沉默了很久。\n\n（粟柏年）\"这行题记告诉我们什么？\"",
      "backgroundImage": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_passage_question": {
      "id": "m1_passage_question",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "\"元符二年赵大翁布。\"",
      "backgroundImage": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [
        {
          "text": "赵大翁就是墓主真实姓名",
          "next": "m1_passage_wrong"
        },
        {
          "text": "大翁是称谓，题记只能先作时间锚点",
          "next": "m1_passage_correct"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "m1_passage_wrong": {
      "id": "m1_passage_wrong",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "大翁是尊称，不是名字。真实姓名、身份关系、后室遗存，都不能单凭题记定案。",
      "backgroundImage": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_passage_correct",
      "puzzle": null
    },
    "m1_passage_correct": {
      "id": "m1_passage_correct",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"'大翁'是尊称，不是名字。他的真实姓名还需要其他证据。题记是锚点，不是答案——记住这句话。\"",
      "backgroundImage": "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_passage_space",
      "puzzle": null
    },
    "m1_passage_space": {
      "id": "m1_passage_space",
      "kicker": "白沙手记",
      "speaker": "陈怀远",
      "body": "（陈怀远）\"九枚破子棂，斜向分开。《营造法式》里叫'破子棂窗'，棂条断面是正方形旋转四十五度，像菱形。宋人做窗，不只为透光，也为看出去的时候，把外面的景切成碎片。\"他收回手，\"这窗是假的，外面没有景。但做法和真窗一样。\"",
      "backgroundImage": "assets/M1/09_过道/插图九 第一号墓过道两壁的破子棂窗.png",
      "portrait": "assets/story/portraits/陈怀远.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_rear_entry": {
      "id": "m1_rear_entry",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "穿过过道后，空间一下收住了。墙更近，光更窄，声音也像被砖面吞掉。\n\n后室平面六角形，比前室紧凑得多。手电光打在墙上，影子沿着砖缝折出六个面。\n\n粟柏年的手电直接打向北壁。正中砌着假门，门额上雕砖作门簪四枚，外侧两枚较大，四瓣蒂形；内侧两枚较小，圆形。版门两扇，左扇向北微启。砖雕少女立于门外，垂双髻，着窄袖衫和长裙，裙下露尖鞋，右手作启门状，脸微偏向门缝，像在听门外有没有人来。砖雕上原本敷有彩色，已经脱落，只剩下青灰色的砖胎。妇人启门是宋代墓葬常见图像母题，表示门后还有庭院、厅堂，墓室至此未到尽头——图像空间延续，非物理通道。\n\n（粟柏年）\"下葬的那天，有人站在这扇假门前，把门推开，又关上。最后留了一条缝。\"",
      "backgroundImage": "assets/M1/11_后室_南壁/第一号墓后室南壁一一后室入口背面.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": "m1_rear_bed",
      "puzzle": null
    },
    "m1_rear_false_door": {
      "id": "m1_rear_false_door",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "穿过过道后，空间一下收住了。墙更近，光更窄，声音也像被砖面吞掉。\n\n后室平面六角形，比前室紧凑得多。手电光打在墙上，影子沿着砖缝折出六个面。\n\n粟柏年的手电直接打向北壁。正中砌着假门，门额上雕砖作门簪四枚，外侧两枚较大，四瓣蒂形；内侧两枚较小，圆形。版门两扇，左扇向北微启。砖雕少女立于门外，垂双髻，着窄袖衫和长裙，裙下露尖鞋，右手作启门状，脸微偏向门缝，像在听门外有没有人来。砖雕上原本敷有彩色，已经脱落，只剩下青灰色的砖胎。妇人启门是宋代墓葬常见图像母题，表示门后还有庭院、厅堂，墓室至此未到尽头——图像空间延续，非物理通道。\n\n（粟柏年）\"下葬的那天，有人站在这扇假门前，把门推开，又关上。最后留了一条缝。\"",
      "backgroundImage": "assets/M1/10_后室_北壁/插图一三 第一号墓后室北壁假门.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_rear_bed": {
      "id": "m1_rear_bed",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "粟柏年从假门前退开，手电光下落到北壁下部。一片低平的砖面铺展在地面上。\n\n（粟柏年）\"砖床。后室的基准。\"\n\n（赵老倔）\"小苏，你来得正好。俺刚跟林同志说，这墓里要是冒出个骨头架子，还得你给它相面。\"\n\n苏池推了推眼镜，没接话，只是蹲下来，把裤腿往下拉了拉——哪怕已经沾了灰，他也不卷。\n\n（苏池）\"骨头不用相，量就行。先找基准。没有砖床，后面的点都会散。\"\n\n他蹲在砖床边，手里握着一卷皮尺，解开皮尺的金属搭扣，把零刻度端抵在北壁根，尺身沿着砖床的中轴铺开。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_rear_bones": {
      "id": "m1_rear_bones",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "头骨并列安放，枕骨朝下，面朝西偏北。身体其余部分的骨骼混堆在头骨东侧，小骨片散乱重叠，像被时间打翻的一盒棋子。\n\n你感到后颈的汗毛竖了起来。前室的乐舞、宴饮、开芳宴还在脑子里转，突然之间，所有\"像故事\"的东西都有了重量。\n\n（苏池）\"看盆骨。这具男，这具女。\"他用镊子尖轻轻点了点，\"牙齿磨耗。男的臼齿磨耗到牙本质了，四十五到五十五岁。女的磨耗浅一些，大概年轻十岁。\"",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [],
      "next": "m1_rear_boundary",
      "puzzle": null
    },
    "m1_rear_boundary": {
      "id": "m1_rear_boundary",
      "kicker": "白沙手记",
      "speaker": "粟柏年",
      "body": "（粟柏年）\"人骨是事实。人的故事还要慢慢分栏。\"",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/粟柏年.png",
      "choices": [],
      "next": null,
      "puzzle": null
    },
    "m1_rear_question": {
      "id": "m1_rear_question",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "两具骨骼为什么会呈现头骨并列、其余骨骼混堆？",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [
        {
          "text": "被火烧过，骨殖散乱",
          "next": "m1_rear_wrong"
        },
        {
          "text": "墓被盗扰，盗墓者翻乱了",
          "next": "m1_rear_wrong"
        },
        {
          "text": "迁葬时骨骼已经二次收拾",
          "next": "m1_rear_correct"
        }
      ],
      "next": null,
      "puzzle": null
    },
    "m1_rear_wrong": {
      "id": "m1_rear_wrong",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "盗扰和焚烧都要有对应痕迹。这里首先要回到尺寸、范围和骨骼状态。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [],
      "next": "m1_rear_correct",
      "puzzle": null
    },
    "m1_rear_correct": {
      "id": "m1_rear_correct",
      "kicker": "白沙手记",
      "speaker": "苏池",
      "body": "对。迁葬。判断可以写，但身份关系还不能写死。地券、砖床、人骨、铁钉和日常器物，要分栏再合看。",
      "backgroundImage": "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
      "portrait": "assets/story/portraits/苏池.png",
      "choices": [],
      "next": null,
      "puzzle": null
    }
  }
};
})();

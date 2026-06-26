window.M1_CONCLUSION_CARD_DATA = {
  "version": "conclusion-card-qa-step-questions-20260626",
  "chapterOrder": [
    "environment",
    "tomb_gate",
    "corridor",
    "front_chamber",
    "passage",
    "rear_chamber"
  ],
  "chapterTitles": {
    "environment": "墓外环境",
    "tomb_gate": "墓门",
    "corridor": "甬道",
    "front_chamber": "前室",
    "passage": "过道",
    "rear_chamber": "后室"
  },
  "docClueRecordMap": {
    "baisha_location": [
      "environment:baisha_location"
    ],
    "baisha_context_view": [
      "environment:baisha_context_view"
    ],
    "baisha_area_relation": [
      "environment:baisha_area_relation"
    ],
    "m1_sequence_map": [
      "environment:m1_sequence_map"
    ],
    "six_part_sequence": [
      "environment:six_part_sequence"
    ],
    "view_outer_gate": [
      "environment:view_outer_gate"
    ],
    "outer_gate_relation": [
      "environment:outer_gate_relation"
    ],
    "brick_structure_detail": [
      "tomb_gate:brick_structure_detail"
    ],
    "M1_miammen_structure": [
      "tomb_gate:gate_parts_relation"
    ],
    "M1_gate_bracket_types": [
      "tomb_gate:gate_parts_relation"
    ],
    "M1_gate_relation": [
      "tomb_gate:lintel"
    ],
    "m1_back wall detail": [
      "rear_chamber:false_door_lintel_frame"
    ],
    "color arrangement description": [
      "tomb_gate:gate_structure_diagram_link"
    ],
    "M1 outside wall details": [
      "tomb_gate:gate_structure_diagram_link"
    ],
    "M1_longdao": [
      "corridor:east_wall_direction"
    ],
    "M1_longdao_gate": [
      "corridor:gate_back_from_corridor"
    ],
    "M1_longdao_fresco": [
      "corridor:east_wall_direction"
    ],
    "M1_longdao_fresco2": [
      "corridor:west_wall_inscription"
    ],
    "M1_longdao_fresco3": [
      "corridor:west_wall_wine_bottle"
    ],
    "food_beverage": [
      "corridor:west_wall_wine_bottle"
    ],
    "architectural section_drawing": [
      "corridor:roof_pattern_detail"
    ],
    "M1_front_hall": [
      "front_chamber:brick_table"
    ],
    "M1_front_hall_decoration": [
      "front_chamber:female_musicians"
    ],
    "M1_front_hall_fresco_west": [
      "front_chamber:brick_table"
    ],
    "M1_front_hall_fresco_west_details": [
      "front_chamber:brick_table"
    ],
    "M1_front_hall_fresco_west_details2": [
      "front_chamber:brick_table"
    ],
    "M1_front_hall_fresco_west_details3": [
      "front_chamber:high_bottle"
    ],
    "M1_corridor_window": [
      "passage:lattice_window"
    ],
    "M1_corridor_window2": [
      "passage:inscription"
    ],
    "M1_corridor_ceiling": [
      "passage:ceiling_canopy"
    ],
    "M1_ceiling_type": [
      "passage:canopy_center"
    ],
    "M1_back_hall_structure": [
      "rear_chamber:rear_wall_overview"
    ],
    "M1_back_hall_bracket": [
      "rear_chamber:rear_ceiling_small_bracket"
    ],
    "M1_back_hall_ceiling": [
      "rear_chamber:rear_ceiling_overview"
    ],
    "color_matching_detail": [
      "rear_chamber:rear_northwest_bracket_detail"
    ],
    "M1_back_hall_fresco_details": [
      "rear_chamber:woman_door"
    ],
    "historical_writing_notes_6": [
      "rear_chamber:woman_hand"
    ]
  },
  "referenceOnlyDocIds": [
    "Sort_ZhangJia",
    "Song_Arrangement_Shu",
    "Song_Arrangement_Shi",
    "cross_analysis",
    "Northern Wei_Fresco_Notes",
    "religious_belief"
  ],
  "clueCards": [
    {
      "id": "clue_puzzle_01",
      "puzzleNo": 1,
      "chapterKey": "environment",
      "chapterTitle": "墓外环境",
      "title": "风水宝地，还是富贵险中求？",
      "corePuzzle": "翻开泛黄的地图，白沙镇北的这片谷地三面环山、前临颍水，堪舆书上说这是“上吉之地”。可是，旁边就是通往洛阳的官道，周围还有冶铁作坊和码头……一个地主家，真能轻轻松松占到这样的位置？\n问题一： 这片“风水宝地”，是靠运气还是靠实力占到的？\n问题二： 这风水，到底是在保佑死去的赵大翁，还是帮他活着的子孙挣更多钱？",
      "finalConclusion": "这片谷地，不是为了“安魂”选的，而是为了“炫富”和“守财”选的。风水先生看的是龙脉，赵家看的是水道的运费。墓地的位置，就是赵家财富的“名片”。",
      "docClues": [
        {
          "clueNo": 1,
          "docId": "baisha_location",
          "text": "墓葬位于河南禹县白沙镇北的谷地，三面环山，前临颍水。北宋时属西京洛阳管辖。",
          "recordIds": [
            "environment:baisha_location"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 3,
          "docId": "baisha_context_view",
          "text": "白沙附近图补充了墓群与周边地貌的关系。",
          "recordIds": [
            "environment:baisha_context_view"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 7,
          "docId": "baisha_area_relation",
          "text": "该图用于标注村落、墓群范围和进入M1的方向。",
          "recordIds": [
            "environment:baisha_area_relation"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "environment:baisha_location",
        "environment:baisha_context_view",
        "environment:baisha_area_relation"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "这片“风水宝地”，是靠运气还是靠实力占到的？",
          "sourceText": "占地的门槛。 北宋《地理新书》里定义的“上吉之地”有严格的地形和水文要求。普通人既不懂门道，也没那个社会关系去“占”下这样一块地。赵家能有这个操作，说明——他们不光有钱，在当地说话也管用。",
          "options": [
            {
              "text": "赵家不光有钱，在当地说话也管用，才能占下这块地",
              "correct": true
            },
            {
              "text": "纯属运气，普通农民也能随便占到",
              "correct": false
            },
            {
              "text": "这块地根本不是什么好地，是别人挑剩的",
              "correct": false
            }
          ],
          "question": "这片“风水宝地”，是靠运气还是靠实力占到的？",
          "answerExplanation": "北宋《地理新书》里定义的“上吉之地”有严格的地形和水文要求。普通人既不懂门道，也没那个社会关系去“占”下这样一块地。赵家能有这个操作，说明——他们不光有钱，在当地说话也管用。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "这风水，到底是在保佑死去的赵大翁，还是帮他活着的子孙挣更多钱？",
          "sourceText": "水运就是钱脉。 “前临颍水”四个字很关键。颍水是直通汴京的黄金水道，三面环山看似闭塞，其实是把这条财路守住了。这风水与其说是在保佑“阴宅安宁”，不如说是在标记——我们赵家，靠这条水发财。",
          "options": [
            {
              "text": "纯粹是为了让赵大翁在阴间住得安宁",
              "correct": false
            },
            {
              "text": "赵家不懂风水，随便请了个先生看的",
              "correct": false
            },
            {
              "text": "风水是为了标记赵家靠颍水水道发财，是“炫富”和“守财”的地标",
              "correct": true
            }
          ],
          "question": "这风水，到底是在保佑死去的赵大翁，还是帮他活着的子孙挣更多钱？",
          "answerExplanation": "“前临颍水”四个字很关键。颍水是直通汴京的黄金水道，三面环山看似闭塞，其实是把这条财路守住了。这风水与其说是在保佑“阴宅安宁”，不如说是在标记——我们赵家，靠这条水发财。"
        }
      ]
    },
    {
      "id": "clue_puzzle_02",
      "puzzleNo": 2,
      "chapterKey": "environment",
      "chapterTitle": "墓外环境",
      "title": "双室墓的“户型图”里，藏了什么葬礼的秘密？",
      "corePuzzle": "手稿图把M1拆成了五个部分：墓门、甬道、前室、过道、后室。有个朋友问：“人死就剩一把骨头，搞那么多房间干啥？又不是酒店套房。”\n低头看了一眼手稿右侧的剖面图——那些阶梯状的承重结构，好像不只是为了好看。\n问题一： 如果是一次性下葬，把棺材放进去、封上门就行了。多造这么多“厅”和“过道”，图什么？\n问题二： 那个阶梯状的承重结构，是能解决什么“打开墓门再关上”的实际麻烦？",
      "finalConclusion": "M1不是一次性的“封存盒”，而是一个可重复进出的“家族地宫”。复杂的空间序列，是为了应对“迁葬”和“合葬”的习俗。手稿里露出的阶梯结构，就是这座地宫有“多次开门计划”的实锤。",
      "docClues": [
        {
          "clueNo": 2,
          "docId": "m1_sequence_map",
          "text": "M1是前后双室墓，由墓门、甬道、前室、过道、后室五部分组成。",
          "recordIds": [
            "environment:m1_sequence_map"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 4,
          "docId": "six_part_sequence",
          "text": "手稿图显示左侧是完整的拱门立面，右侧剖开露出内部的阶梯状承重结构。",
          "recordIds": [
            "environment:six_part_sequence"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "environment:m1_sequence_map",
        "environment:six_part_sequence"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "如果是一次性下葬，把棺材放进去、封上门就行了。多造这么多“厅”和“过道”，图什么？",
          "sourceText": "一次葬 vs 二次葬。 如果是“一次葬”，墓道挖个坑、墓室砌个单间就够了。但M1搞出了前室后室、过道，这布局更像是在说：“以后还有人要进来”——要么是把先人的骨殖从别处迁过来合葬，要么是预留了等后人去世再打开门放进来的空间。这种“二次葬”，需要多个空间来安排仪式流程。",
          "options": [
            {
              "text": "赵大翁喜欢住大房子，生前习惯延续到死后",
              "correct": false
            },
            {
              "text": "工匠多收工钱，故意多砌了几个房间",
              "correct": false
            },
            {
              "text": "为了以后还能打开墓门，进行二次葬或合葬",
              "correct": true
            }
          ],
          "question": "如果是一次性下葬，把棺材放进去、封上门就行了。多造这么多“厅”和“过道”，图什么？",
          "answerExplanation": "如果是“一次葬”，墓道挖个坑、墓室砌个单间就够了。但M1搞出了前室后室、过道，这布局更像是在说：“以后还有人要进来”——要么是把先人的骨殖从别处迁过来合葬，要么是预留了等后人去世再打开门放进来的空间。这种“二次葬”，需要多个空间来安排仪式流程。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "那个阶梯状的承重结构，是能解决什么“打开墓门再关上”的实际麻烦？",
          "sourceText": "反复开门的硬需求。 阶梯状的承重结构，不是为了装饰。它能让墓门在被打开和重新封上多次后，依然不塌不裂。如果是一次下葬后就永远封死，根本不需要这种结构。所以，它直接指向了——M1在很多年里，可能被打开过不止一次。",
          "options": [
            {
              "text": "方便盗墓贼进出",
              "correct": false
            },
            {
              "text": "让墓门能被多次打开和重新封闭后依然不塌不裂",
              "correct": true
            },
            {
              "text": "只是为了装饰好看，没有实际作用",
              "correct": false
            }
          ],
          "question": "那个阶梯状的承重结构，是能解决什么“打开墓门再关上”的实际麻烦？",
          "answerExplanation": "阶梯状的承重结构，不是为了装饰。它能让墓门在被打开和重新封上多次后，依然不塌不裂。如果是一次下葬后就永远封死，根本不需要这种结构。所以，它直接指向了——M1在很多年里，可能被打开过不止一次。"
        }
      ]
    },
    {
      "id": "clue_puzzle_03",
      "puzzleNo": 3,
      "chapterKey": "environment",
      "chapterTitle": "墓外环境",
      "title": "封门砖多了“一层”，只是更坚固吗？",
      "corePuzzle": "你注意到，M1的封门砖有三层，而第二、三号墓的封门砖只有两层。同样是赵家墓，为什么老大的墓门就要多砌一层？\n有人猜：“多一层肯定更结实呗。”\n但低头看看墓道——越往墓门方向，墓道越窄。这个细节，可能和封门砖的层数之间藏着一条线索。\n问题一： 多一层封门砖，除了“更结实”之外，还多出了什么？\n问题二： 墓道“越往门越窄”的设计，和封门砖有什么关系？",
      "finalConclusion": "多一层封门砖，不是“怕盗墓”，而是“给门户加码”。M1的三层结构不只是工程学选择，更是一份“面子工程”——告诉周边所有人：赵家大当家，走得体面、封得隆重。而梯形墓道，则是保证这份“面子”能几百年不塌的巧妙设计。",
      "docClues": [
        {
          "clueNo": 5,
          "docId": "view_outer_gate",
          "text": "墓门外层封门砖由横砖和菱角牙子混砌。",
          "recordIds": [
            "environment:view_outer_gate"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 6,
          "docId": "outer_gate_relation",
          "text": "墓门外侧有平坦区域，墓道侧壁愈北愈宽。",
          "recordIds": [
            "environment:outer_gate_relation"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 17,
          "docId": "brick_structure_detail",
          "text": "封门砖共三层：外层（横砖+菱角牙子），中层（全部横砖），内层（全部卧丁砖）。",
          "recordIds": [
            "tomb_gate:brick_structure_detail"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "environment:view_outer_gate",
        "environment:outer_gate_relation",
        "tomb_gate:brick_structure_detail"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "多一层封门砖，除了“更结实”之外，还多出了什么？",
          "sourceText": "多一层，是多一份“面子”。 外层封门砖用了“菱角牙子”（一种花哨的斜砌工艺），已经很好看了。但M1比二、三号墓还多了一层内层的卧丁砖。这说明：不是“不够坚固才加的”，而是赵大翁作为家族的立祖者，必须享受比后代更隆重的“入土规格”。这是给活人看的排场。",
          "options": [
            {
              "text": "工匠砌砖时算错了层数",
              "correct": false
            },
            {
              "text": "作为家族立祖者的赵大翁，需要比后代更隆重的“入土规格”和排场",
              "correct": true
            },
            {
              "text": "赵大翁特别怕盗墓贼",
              "correct": false
            }
          ],
          "question": "多一层封门砖，除了“更结实”之外，还多出了什么？",
          "answerExplanation": "外层封门砖用了“菱角牙子”（一种花哨的斜砌工艺），已经很好看了。但M1比二、三号墓还多了一层内层的卧丁砖。这说明：不是“不够坚固才加的”，而是赵大翁作为家族的立祖者，必须享受比后代更隆重的“入土规格”。这是给活人看的排场。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "墓道“越往门越窄”的设计，和封门砖有什么关系？",
          "sourceText": "墓道形状的工程密码。 墓道“越往门越窄”，这叫“梯形墓道”。它的好处是：当工匠砌封门砖时，从最窄处开始一层层往外码，后面的土层会自然挤压住砖墙，越压越紧。如果墓道是直的，这种挤压效应就差很多。所以，梯形墓道+三层封门砖，是一套为“拱门结构”量身定制的工程方案。",
          "options": [
            {
              "text": "梯形墓道让土层自然挤压封门砖，越压越紧，保证几百年不塌",
              "correct": true
            },
            {
              "text": "墓道窄是为了让送葬队伍排队进去",
              "correct": false
            },
            {
              "text": "窄墓道方便日后盗墓",
              "correct": false
            }
          ],
          "question": "墓道“越往门越窄”的设计，和封门砖有什么关系？",
          "answerExplanation": "墓道“越往门越窄”，这叫“梯形墓道”。它的好处是：当工匠砌封门砖时，从最窄处开始一层层往外码，后面的土层会自然挤压住砖墙，越压越紧。如果墓道是直的，这种挤压效应就差很多。所以，梯形墓道+三层封门砖，是一套为“拱门结构”量身定制的工程方案。"
        }
      ]
    },
    {
      "id": "clue_puzzle_04",
      "puzzleNo": 4,
      "chapterKey": "tomb_gate",
      "chapterTitle": "墓门",
      "title": "这门楼到底是“门面”还是“身份证”？",
      "corePuzzle": "这座墓门，三层楼那么高，上面还雕梁画栋地搞了一整套复杂的斗拱——明明就是个埋人的地洞入口，弄得比我家客厅都气派。\n可问题是：这种“单抄单昂重栱五铺作”，在宋代可不是谁想用就能用的。天圣年间朝廷有规定——不是官员，门前不许用重栱。\n问题一： 赵大翁一个白衣平民，用这种“僭越”级别的斗拱，是在跟谁叫板？\n问题二： 既然他敢这么搞，那他到底是“不懂规矩”的暴发户，还是“明知故犯”的狠角色？",
      "finalConclusion": "这座门楼，就是赵大翁的“身份证”。它不是学官府建的，而是学汴京最繁华的商业街上那些酒楼铺面建的。他用商人的语言，给自己造了一扇“有钱就能任性”的大门——制度不让我当官，那我自己给自己建个官样门楼，总行吧？",
      "docClues": [
        {
          "clueNo": 18,
          "docId": "M1_miammen_structure",
          "text": "墓门通高3.68米，正面是摹仿木建筑的门楼，由门基、倚柱、阑额、门额、门簪、普拍方、铺作、撩风𣏢、檐椽、飞檐椽、瓯瓦、门脊等部分组成。",
          "recordIds": [
            "tomb_gate:gate_parts_relation"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 19,
          "docId": "M1_gate_bracket_types",
          "text": "铺作（斗拱）为“单抄单昂重栱五铺作”，材高15厘米，栔高5.2厘米。",
          "recordIds": [
            "tomb_gate:gate_parts_relation"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 94,
          "docId": "Sort_ZhangJia",
          "text": "这些尺寸和《营造法式》里规定的“第八等材”接近，而第八等材正好是用来造“殿内藻井”和“小亭榭”的。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "tomb_gate:gate_parts_relation"
      ],
      "referenceDocIds": [
        "Sort_ZhangJia"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "赵大翁一个白衣平民，用这种“僭越”级别的斗拱，是在跟谁叫板？",
          "sourceText": "礼制就是高压线。 北宋《舆服志》白纸黑字写着：“非品官毋得起门屋……非宫室寺观毋得彩绘栋宇。” 但赵大翁不仅起了门屋，还用上了重栱。这说明：他不是不懂，而是根本不在乎——或者说，他有足够的底气让官府睁一只眼闭一只眼。地方富户的财力，有时候比一纸空文更有分量。",
          "options": [
            {
              "text": "赵大翁有底气让官府睁一只眼闭一只眼，用财力挑战礼制",
              "correct": true
            },
            {
              "text": "赵大翁不懂礼制，误打误撞用了重栱",
              "correct": false
            },
            {
              "text": "朝廷规定已经废除，谁都可以用",
              "correct": false
            }
          ],
          "question": "赵大翁一个白衣平民，用这种“僭越”级别的斗拱，是在跟谁叫板？",
          "answerExplanation": "北宋《舆服志》白纸黑字写着：“非品官毋得起门屋……非宫室寺观毋得彩绘栋宇。” 但赵大翁不仅起了门屋，还用上了重栱。这说明：他不是不懂，而是根本不在乎——或者说，他有足够的底气让官府睁一只眼闭一只眼。地方富户的财力，有时候比一纸空文更有分量。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "既然他敢这么搞，那他到底是“不懂规矩”的暴发户，还是“明知故犯”的狠角色？",
          "sourceText": "材分暴露了来源。 这座门楼的斗拱材高只有15厘米，属于“第八等材”。有趣的是，第八等材恰恰是《营造法式》里指定给小木作（精细装修） 用的，而不是大木作（主体结构）用的。这说明：赵大翁请的工匠，很可能平时在汴京街头给那些豪华酒楼扎“欢门”、造“山棚”——他们把小木作的技术，直接搬到了地宫里。",
          "options": [
            {
              "text": "他是个不懂规矩的暴发户，随便请了工匠乱建",
              "correct": false
            },
            {
              "text": "他偷偷请了官式工匠，想冒充官员",
              "correct": false
            },
            {
              "text": "赵大翁请的工匠来自汴京商业街，用小木作技术给自己造了一扇“有钱就能任性”的大门",
              "correct": true
            }
          ],
          "question": "既然他敢这么搞，那他到底是“不懂规矩”的暴发户，还是“明知故犯”的狠角色？",
          "answerExplanation": "这座门楼的斗拱材高只有15厘米，属于“第八等材”。有趣的是，第八等材恰恰是《营造法式》里指定给小木作（精细装修） 用的，而不是大木作（主体结构）用的。这说明：赵大翁请的工匠，很可能平时在汴京街头给那些豪华酒楼扎“欢门”、造“山棚”——他们把小木作的技术，直接搬到了地宫里。"
        }
      ]
    },
    {
      "id": "clue_puzzle_05",
      "puzzleNo": 5,
      "chapterKey": "tomb_gate",
      "chapterTitle": "墓门",
      "title": "门簪四枚——纯粹的装饰，还是暗藏玄机？",
      "corePuzzle": "墓门正面明明只有两枚门簪，可到了后室的假门上，门簪变成了四枚——而且形状还不一样：外面两枚是方的，里面两枚是圆的。\n有个朋友瞥了一眼说：“不就是多几个疙瘩嘛，可能工匠手头凑巧有不同形状的砖。”可你蹲下来仔细看了看，发现事情没那么简单——\n问题一： 门上这两枚“疙瘩”，从唐代的方形变成宋代的圆形，又变成金代的八角形……门簪形状的变化，到底代表着什么在“变”？\n问题二： 为什么后室假门上的四枚门簪要“外方内圆”？这是随意搭配，还是有意为之？",
      "finalConclusion": "门簪的形状，是墓葬的“时代表情”。M1后室假门“外方内圆”的混搭，正好落在北宋门簪从方到圆的演变节点上，成为了断代的一条铁证。而它刻意追求的形式对比，更说明赵家在对工匠的选择上——挑的是好手，不是庸工。",
      "docClues": [
        {
          "clueNo": 20,
          "docId": "M1_gate_relation",
          "text": "门额正面砌出两枚方形门簪，面部浮雕四瓣蒂形。",
          "recordIds": [
            "tomb_gate:lintel"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 85,
          "docId": "m1_back wall detail",
          "text": "后室北壁假门的门额上则有四枚门簪：外侧两枚作四瓣蒂形（较大），内侧两枚作圆形（较小）。",
          "recordIds": [
            "rear_chamber:false_door_lintel_frame"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 132,
          "docId": "Song_Arrangement_Shu",
          "text": "唐代至北宋中期，门簪多为正方形或扁方形。圆形门簪始于北宋中期。",
          "recordIds": [],
          "referenceOnly": true
        },
        {
          "clueNo": 133,
          "docId": "Song_Arrangement_Shi",
          "text": "金代开始出现八角形门簪。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "tomb_gate:lintel",
        "rear_chamber:false_door_lintel_frame"
      ],
      "referenceDocIds": [
        "Song_Arrangement_Shu",
        "Song_Arrangement_Shi"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "门上这两枚“疙瘩”，从唐代的方形变成宋代的圆形，又变成金代的八角形……门簪形状的变化，到底代表着什么在“变”？",
          "sourceText": "门簪是建筑断代的“年轮”。 “唐代→方形、北宋→正方形与圆形并存、金代→八角形”——这不是随机变化，而是工艺审美的演进节奏。后室假门上“方+圆”混搭，正好卡在北宋晚期的过渡期，和M1的“元符二年”纪年完全吻合。如果你在另一座墓里看到“清一色圆形”，那它肯定比M1晚；如果看到“纯方形”，那就比M1早。这就是建筑考古里的“生物钟”。",
          "options": [
            {
              "text": "工匠手头有什么砖就用什么形状，没有规律",
              "correct": false
            },
            {
              "text": "方形门簪代表穷人，圆形代表富人",
              "correct": false
            },
            {
              "text": "门簪是建筑断代的“年轮”，形状变化反映了工艺审美的演进节奏",
              "correct": true
            }
          ],
          "question": "门上这两枚“疙瘩”，从唐代的方形变成宋代的圆形，又变成金代的八角形……门簪形状的变化，到底代表着什么在“变”？",
          "answerExplanation": "“唐代→方形、北宋→正方形与圆形并存、金代→八角形”——这不是随机变化，而是工艺审美的演进节奏。后室假门上“方+圆”混搭，正好卡在北宋晚期的过渡期，和M1的“元符二年”纪年完全吻合。如果你在另一座墓里看到“清一色圆形”，那它肯定比M1晚；如果看到“纯方形”，那就比M1早。这就是建筑考古里的“生物钟”。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "为什么后室假门上的四枚门簪要“外方内圆”？这是随意搭配，还是有意为之？",
          "sourceText": "“外方内圆”并非随意搭配。 外侧两枚大方形，内侧两枚小圆形——在视觉上形成了一种“主次分明”的韵律。考虑到宋代建筑彩画中经常出现“方胜”和“叠晕”这种对比组合，这很可能是工匠刻意设计的秩序美学：以方为骨，以圆为饰。这也暗示，这位工匠的手艺非常老练，他对视觉节奏是有把控的，不是随便拿砖凑数。",
          "options": [
            {
              "text": "外方内圆是风水要求，不这样就会倒霉",
              "correct": false
            },
            {
              "text": "工匠刻意设计的秩序美学：以方为骨，以圆为饰，显示手艺老练",
              "correct": true
            },
            {
              "text": "当时砖不够了，随便凑的",
              "correct": false
            }
          ],
          "question": "为什么后室假门上的四枚门簪要“外方内圆”？这是随意搭配，还是有意为之？",
          "answerExplanation": "外侧两枚大方形，内侧两枚小圆形——在视觉上形成了一种“主次分明”的韵律。考虑到宋代建筑彩画中经常出现“方胜”和“叠晕”这种对比组合，这很可能是工匠刻意设计的秩序美学：以方为骨，以圆为饰。这也暗示，这位工匠的手艺非常老练，他对视觉节奏是有把控的，不是随便拿砖凑数。"
        }
      ]
    },
    {
      "id": "clue_puzzle_06",
      "puzzleNo": 6,
      "chapterKey": "tomb_gate",
      "chapterTitle": "墓门",
      "title": "彩画这么“素”，是没钱还是故意的？",
      "corePuzzle": "你抬头看着墓门那些残存的彩画——门脊上是黄赭两色的叠胜纹，阑额上是柿蒂纹，门额上是墨笔画卷草……看起来挺花哨，但仔细一数，翻来覆去就三种颜色：赭石、青色、白色。\n你想起《营造法式》里提到过的“五彩遍装”，那可是真正的金碧辉煌。而M1的彩画，明显属于更低一档的“解绿结华装”。\n问题一： 死都不怕花钱，怎么彩画反倒不敢上“五彩”了？是钱不够，还是有什么规矩卡着？\n问题二： 后门和前门的“待遇差”——为什么墓门正面画得这么复杂，背面却光秃秃的连个纹都没有？",
      "finalConclusion": "M1的彩画选“解绿结华装”而不是“五彩遍装”，不是抠门，是懂规矩——以平民之身在礼制允许的极限上做文章，这叫“高明的低调”。而前门有花背后门光板儿的差异，则透露了一个朴素的道理：面子是做给活人看的。赵家在这座墓上的每一笔投入，都算好了“谁在看、看多久”。",
      "docClues": [
        {
          "clueNo": 89,
          "docId": "color arrangement description",
          "text": "墓门正面原施彩画，但因填土侵蚀大多漫漶。可辨识的有：门脊绘赭、黄两色叠胜，阑额画赭地柿蒂，门额、立颊墨画卷草，门额背面两端墨画流云、双禽，中绘牡丹。",
          "recordIds": [
            "tomb_gate:gate_structure_diagram_link"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 93,
          "docId": "M1 outside wall details",
          "text": "墓门背面上部自脊以下贴砌横砖垂直砌下，直至甬道顶，未加任何雕饰。",
          "recordIds": [
            "tomb_gate:gate_structure_diagram_link"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 94,
          "docId": "Sort_ZhangJia",
          "text": "铺作的彩画形式与《营造法式》记载的“解绿结华装”相似，主色只有赭、青、白三色。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "tomb_gate:gate_structure_diagram_link"
      ],
      "referenceDocIds": [
        "Sort_ZhangJia"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "死都不怕花钱，怎么彩画反倒不敢上“五彩”了？是钱不够，还是有什么规矩卡着？",
          "sourceText": "色彩也是等级语言。 会不会是“钱不够”？报告里提到，赵大翁家的壁画可是请了一大批人马（包括后来成名的叶浅予、董希文），钱显然不是问题。那答案只能是：五彩遍装是皇家和寺庙的专属特权。赵大翁就算再有钱，也不敢真的把自己地宫画得跟宫殿一样——那就不是“僭越”，而是“造反”了。所以，他挑了一个比“五彩”低一档、但又足够体面的“解绿结华装”。在红线边缘疯狂试探，这才是富商的操作。",
          "options": [
            {
              "text": "当时颜料缺货，买不到五彩的颜料",
              "correct": false
            },
            {
              "text": "五彩遍装是皇家和寺庙专属，赵大翁不敢“造反”，所以选了低一档的“解绿结华装”",
              "correct": true
            },
            {
              "text": "赵大翁太抠门，舍不得花钱上五彩",
              "correct": false
            }
          ],
          "question": "死都不怕花钱，怎么彩画反倒不敢上“五彩”了？是钱不够，还是有什么规矩卡着？",
          "answerExplanation": "会不会是“钱不够”？报告里提到，赵大翁家的壁画可是请了一大批人马（包括后来成名的叶浅予、董希文），钱显然不是问题。那答案只能是：五彩遍装是皇家和寺庙的专属特权。赵大翁就算再有钱，也不敢真的把自己地宫画得跟宫殿一样——那就不是“僭越”，而是“造反”了。所以，他挑了一个比“五彩”低一档、但又足够体面的“解绿结华装”。在红线边缘疯狂试探，这才是富商的操作。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "后门和前门的“待遇差”——为什么墓门正面画得这么复杂，背面却光秃秃的连个纹都没有？",
          "sourceText": "前门给人看，后门给鬼看。 墓门正面紧挨着墓道，在封土之前，是所有送葬亲友能看到的最后一眼。所以这里必须光鲜亮丽，是“面子工程”的最后亮相。而墓门背面朝向甬道和墓室内部，那是只有死者灵魂进出的通道——死了就没人看了，刷一层赭色算是给个交代，没必要再费工画花了。这种“前精后糙”的玩法，说明：造墓的人非常清楚，观众分两种——活人 vs 死人。",
          "options": [
            {
              "text": "正面是给活人送葬时看的“面子工程”，背面朝向墓室内部，只有死者灵魂进出，没必要费工",
              "correct": true
            },
            {
              "text": "背面被土埋了，彩画都掉了",
              "correct": false
            },
            {
              "text": "工匠偷懒，背面没画完",
              "correct": false
            }
          ],
          "question": "后门和前门的“待遇差”——为什么墓门正面画得这么复杂，背面却光秃秃的连个纹都没有？",
          "answerExplanation": "墓门正面紧挨着墓道，在封土之前，是所有送葬亲友能看到的最后一眼。所以这里必须光鲜亮丽，是“面子工程”的最后亮相。而墓门背面朝向甬道和墓室内部，那是只有死者灵魂进出的通道——死了就没人看了，刷一层赭色算是给个交代，没必要再费工画花了。这种“前精后糙”的玩法，说明：造墓的人非常清楚，观众分两种——活人 vs 死人。"
        }
      ]
    },
    {
      "id": "clue_puzzle_07",
      "puzzleNo": 7,
      "chapterKey": "corridor",
      "chapterTitle": "甬道",
      "title": "甬道壁上的“门中门”——是装饰还是路障？",
      "corePuzzle": "走进甬道，你发现墙上画了两扇门——还不是随便画画的，门板上清清楚楚地有七排门钉，每排五颗，还雕了一个门环。\n可再一看，这门居然悬浮在墙面上——下缘离地面还有一小段距离，不是“贴地而立”的。你想起《营造法式》里提到过一种叫“断砌门”的做法，专门用在门槛会被频繁拆除的地方。\n问题一： 甬道里为什么要在墙上画两扇“门”？它们的功能是什么？\n问题二： 门下那4.5厘米的空隙，到底是想模仿什么？",
      "finalConclusion": "甬道墙上的两扇“断砌门”，是专门为死者灵魂设计的“无障碍通道”。门下那几厘米的空隙，在活人世界里是为了方便马车过；在墓室里，则是为了“别绊着鬼”。赵家在造墓时，连灵魂怎么走路都考虑好了。",
      "docClues": [
        {
          "clueNo": 27,
          "docId": "M1_longdao",
          "text": "甬道东西二壁各砌出高1.17米、宽52厘米、厚2厘米的版门一扇，版门面各砌门钉七排，排五钉，并雕出门环一具。",
          "recordIds": [
            "corridor:east_wall_direction"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 28,
          "docId": "M1_longdao_gate",
          "text": "版门下缘距甬道砖地面留有4.5厘米长的空间，此空间与条砖一块相应，疑为“断砌造”。",
          "recordIds": [
            "corridor:gate_back_from_corridor"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 78,
          "docId": "cross_analysis",
          "text": "注释(28)指出，此门制符合《营造法式》中“断砌门”的记载：版门下留空，不设地栿，而在两颊下安卧栿、立栿。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "corridor:east_wall_direction",
        "corridor:gate_back_from_corridor"
      ],
      "referenceDocIds": [
        "cross_analysis"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "甬道里为什么要在墙上画两扇“门”？它们的功能是什么？",
          "sourceText": "画门不是给你走的，是给魂走的。 甬道是连接墓门和前室的唯一通道，在现实中它只是一条窄砖路。但工匠在这条路的东西墙上各“画”了一扇门，制造出一种“甬道两侧另有两个入口”的错觉。这两个“假门”，不是用来进出的，而是用来暗示：这间墓室还有其他空间——比如储物间、仓库、或者另一条通道。在宋代丧葬观念里，死者的灵魂可以穿墙而过；这些画出来的门，就是为灵魂准备的“任意门”。",
          "options": [
            {
              "text": "画出来的门是“假门”，暗示墓室还有其他空间，是给死者灵魂准备的“任意门”",
              "correct": true
            },
            {
              "text": "为了装饰甬道，让墙壁不那么单调",
              "correct": false
            },
            {
              "text": "真的还有两扇门可以打开，通往别的房间",
              "correct": false
            }
          ],
          "question": "甬道里为什么要在墙上画两扇“门”？它们的功能是什么？",
          "answerExplanation": "甬道是连接墓门和前室的唯一通道，在现实中它只是一条窄砖路。但工匠在这条路的东西墙上各“画”了一扇门，制造出一种“甬道两侧另有两个入口”的错觉。这两个“假门”，不是用来进出的，而是用来暗示：这间墓室还有其他空间——比如储物间、仓库、或者另一条通道。在宋代丧葬观念里，死者的灵魂可以穿墙而过；这些画出来的门，就是为灵魂准备的“任意门”。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "门下那4.5厘米的空隙，到底是想模仿什么？",
          "sourceText": "空隙是“防止门槛绊鬼”。 “断砌门”不是随便留的缝——它在活人建筑里是为了方便车马通行，不设门槛。但在墓室里，这个设计移植过来就有了新的含义：门下留空，是为了不让门槛挡住进出墓室的灵魂或送葬的阴差。那两块放在门下的砖，就是被拿走的“门槛”的替身。",
          "options": [
            {
              "text": "工匠砌砖时没对齐，留下的缝隙",
              "correct": false
            },
            {
              "text": "为了通风，让墓室里空气对流",
              "correct": false
            },
            {
              "text": "模仿“断砌门”——不设门槛，方便灵魂或阴差无障碍通行",
              "correct": true
            }
          ],
          "question": "门下那4.5厘米的空隙，到底是想模仿什么？",
          "answerExplanation": "“断砌门”不是随便留的缝——它在活人建筑里是为了方便车马通行，不设门槛。但在墓室里，这个设计移植过来就有了新的含义：门下留空，是为了不让门槛挡住进出墓室的灵魂或送葬的阴差。那两块放在门下的砖，就是被拿走的“门槛”的替身。"
        }
      ]
    },
    {
      "id": "clue_puzzle_08",
      "puzzleNo": 8,
      "chapterKey": "corridor",
      "chapterTitle": "甬道",
      "title": "甬道壁画里，藏着多少“人情往来”的账本？",
      "corePuzzle": "甬道东西两壁的壁画，画的不是神仙也不是花鸟，而是一群风尘仆仆的小人物：有的扛着钱串，有的背着筒囊，还有人端着一个酒瓶，瓶子上歪歪扭扭写着“画上崔大郎酒”。\n你盯着那个酒瓶看了半天——看起来这不是什么官家祭祀的场面，倒像是……什么人在送礼？\n问题一： 这些扛钱背物、牵马送酒的人，到底是什么身份？他们是仆人，还是“外人”？\n问题二： 为什么要在酒瓶上写“画上崔大郎酒”这么具体的品牌名？这能告诉我们什么？",
      "finalConclusion": "甬道壁画不是随便画的“仪仗队”，而是一份宋代商业社会的“人情往来账本”。赵家人把前来吊唁、送礼、送酒的人全部画在墙上——不仅是为了让死者在地下不寂寞，更是为了明确记录那些“有交情”的人和事。酒瓶上的“崔大郎”三个字，则让我们看到了一个鲜活的、有名有姓的北宋手工业者。",
      "docClues": [
        {
          "clueNo": 29,
          "docId": "M1_longdao_fresco",
          "text": "甬道东壁：三人。右侧一老者（司阍人）作启门状；左二人负筒囊、持钱贯，作贡纳状。",
          "recordIds": [
            "corridor:east_wall_direction"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 30,
          "docId": "M1_longdao_fresco2",
          "text": "甬道西壁：三人一马。左侧一司阍人；中立黑鬃黑尾浅黄马，马后二人，一人执竿（马鞭？），一人手捧黑色酒瓶，瓶身墨书“画上崔大郎酒”。",
          "recordIds": [
            "corridor:west_wall_inscription"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 31,
          "docId": "M1_longdao_fresco3",
          "text": "酒瓶插图上与河南安阳王用墓、辽墓、山西永乐宫壁画中的酒瓶进行了比较。",
          "recordIds": [
            "corridor:west_wall_wine_bottle"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 84,
          "docId": "food_beverage",
          "text": "“画上崔大郎酒”表明此酒来自一位名叫崔大郎的酿酒师傅或酿酒作坊。",
          "recordIds": [
            "corridor:west_wall_wine_bottle"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "corridor:east_wall_direction",
        "corridor:west_wall_inscription",
        "corridor:west_wall_wine_bottle"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "这些扛钱背物、牵马送酒的人，到底是什么身份？他们是仆人，还是“外人”？",
          "sourceText": "送礼的人，不是本家佣人。 如果是赵家的仆人，画中他们应该是恭敬侍立的状态。但画里的人，有的在跟司阍人打招呼（好像在说“放我进去”），有的正急急忙忙往屋里赶——这更像是一群来访者，正在向墓主人赠送礼物。报告指出，这些人是“向墓主人贡纳财物者”和“致送酒物者”。他们可能是赵大翁生前结交的商户、同行、或受其恩惠的人。",
          "options": [
            {
              "text": "赵家的仆人，正在搬运陪葬品",
              "correct": false
            },
            {
              "text": "官府派来征税的差役",
              "correct": false
            },
            {
              "text": "他们是来访者，向墓主人赠送礼物的商户、同行或受其恩惠的人",
              "correct": true
            }
          ],
          "question": "这些扛钱背物、牵马送酒的人，到底是什么身份？他们是仆人，还是“外人”？",
          "answerExplanation": "如果是赵家的仆人，画中他们应该是恭敬侍立的状态。但画里的人，有的在跟司阍人打招呼（好像在说“放我进去”），有的正急急忙忙往屋里赶——这更像是一群来访者，正在向墓主人赠送礼物。报告指出，这些人是“向墓主人贡纳财物者”和“致送酒物者”。他们可能是赵大翁生前结交的商户、同行、或受其恩惠的人。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "为什么要在酒瓶上写“画上崔大郎酒”这么具体的品牌名？这能告诉我们什么？",
          "sourceText": "酒瓶上的“广告”是社交密码。 “画上崔大郎酒”是什么意思？“画上”可能是地名，也可能是人名（如崔大郎是外号）；而“崔大郎”这个称呼，说明他是一位有名有姓、甚至可能颇有口碑的酿酒师。把送礼人的名字和商品名都画进壁画里——这不像是在供奉死者，倒像是在标记社会关系圈。赵家人想让死去的老爹记得：谁送了礼、送了什么礼。而“崔大郎”这个名字被保留，也说明这位酿酒师在当地是有头有脸的人物，值得被“记入史册”。",
          "options": [
            {
              "text": "这是酒瓶广告，赵大翁收了广告费",
              "correct": false
            },
            {
              "text": "“崔大郎”是当地有名有姓的酿酒师，把名字画进壁画是在标记社会关系圈",
              "correct": true
            },
            {
              "text": "赵大翁喜欢喝这个牌子的酒，死后也要带着",
              "correct": false
            }
          ],
          "question": "为什么要在酒瓶上写“画上崔大郎酒”这么具体的品牌名？这能告诉我们什么？",
          "answerExplanation": "“画上崔大郎酒”是什么意思？“画上”可能是地名，也可能是人名（如崔大郎是外号）；而“崔大郎”这个称呼，说明他是一位有名有姓、甚至可能颇有口碑的酿酒师。把送礼人的名字和商品名都画进壁画里——这不像是在供奉死者，倒像是在标记社会关系圈。赵家人想让死去的老爹记得：谁送了礼、送了什么礼。而“崔大郎”这个名字被保留，也说明这位酿酒师在当地是有头有脸的人物，值得被“记入史册”。"
        }
      ]
    },
    {
      "id": "clue_puzzle_09",
      "puzzleNo": 9,
      "chapterKey": "corridor",
      "chapterTitle": "甬道",
      "title": "甬道顶上的“叠胜”纹，是玩花样还是真讲究？",
      "corePuzzle": "你仰头看了一眼甬道的顶，那里刷了一层赭色底，上面画了一个由菱形套叠组成的图案。\n旁边有个笔记写着：这叫“叠胜”，在《营造法式》里能找到一模一样的图样。可问题是——甬道这么窄，也没人会在里面开派对，为什么要在一般人看不见的“天花板”上，搞这么复杂的花纹？\n问题一： “叠胜”是什么意思？为什么偏偏把它放在头顶？\n问题二： 这种藏在“上面”的纹样，它到底是给谁看的？",
      "finalConclusion": "甬道顶的“叠胜”纹，不是随手涂鸦，而是一道精心布置的“生死符”。它的寓意是“连环不断”，放在死者头顶，是用来护送他的灵魂顺利通过生死交汇的甬道。而且这花纹藏在顶上，活人几乎看不见——它从一开始就不是给人看的，是专门画给鬼看的。",
      "docClues": [
        {
          "clueNo": 77,
          "docId": "architectural section_drawing",
          "text": "甬道顶心刷赭色，画赭、黄二色叠胜纹。报告注(78)指出，这种纹样与《营造法式》中的“罗纹叠胜”类似，且盛用于宋代彩画。",
          "recordIds": [
            "corridor:roof_pattern_detail"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 93,
          "docId": "M1 outside wall details",
          "text": "甬道顶叠涩部分通刷赭色。",
          "recordIds": [
            "tomb_gate:gate_structure_diagram_link"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 94,
          "docId": "Sort_ZhangJia",
          "text": "“叠胜”纹在宋人观念中代表“连环不断、子孙昌盛”，常见于桥梁、藻井等处的彩画中。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "corridor:roof_pattern_detail",
        "tomb_gate:gate_structure_diagram_link"
      ],
      "referenceDocIds": [
        "Sort_ZhangJia"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "“叠胜”是什么意思？为什么偏偏把它放在头顶？",
          "sourceText": "“叠胜”就是“叠着赢”。 “胜”在宋代文化里是一种吉祥符号，它的形状像两个菱形叠在一起，寓意延绵不绝、生生不息。放在甬道顶，意思是说：往上走是天堂，往下走是人间，而夹在中间的甬道——就是生死之间的一道“福门”。踩过这段路，就从此告别了阳世的轮回。所以，头顶上的叠胜，其实是给死者灵魂壮胆的“护身符”。",
          "options": [
            {
              "text": "叠胜是赵大翁家的族徽",
              "correct": false
            },
            {
              "text": "“胜”是吉祥符号，寓意延绵不绝、生生不息，放在头顶是给死者灵魂壮胆的“护身符”",
              "correct": true
            },
            {
              "text": "工匠觉得好看，随便画的",
              "correct": false
            }
          ],
          "question": "“叠胜”是什么意思？为什么偏偏把它放在头顶？",
          "answerExplanation": "“胜”在宋代文化里是一种吉祥符号，它的形状像两个菱形叠在一起，寓意延绵不绝、生生不息。放在甬道顶，意思是说：往上走是天堂，往下走是人间，而夹在中间的甬道——就是生死之间的一道“福门”。踩过这段路，就从此告别了阳世的轮回。所以，头顶上的叠胜，其实是给死者灵魂壮胆的“护身符”。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "这种藏在“上面”的纹样，它到底是给谁看的？",
          "sourceText": "给鬼神看的“面子工程”。 活人进墓，不会长时间仰头看顶（甬道很矮）。而《葬书》里说，死者入殓后，灵魂会沿着墓道“升登”，从墓门穿过甬道进入前室。灵魂是飘着的。所以，甬道顶上的彩画，正是给那些“飘过去”的眼睛看的。生者看不见，鬼魂却刚好能看见——这个设计，精准得可怕。",
          "options": [
            {
              "text": "给“飘过去”的灵魂看的——生者看不见，鬼魂却刚好能看见",
              "correct": true
            },
            {
              "text": "给送葬的亲友仰头看的",
              "correct": false
            },
            {
              "text": "给后来的盗墓贼留的记号",
              "correct": false
            }
          ],
          "question": "这种藏在“上面”的纹样，它到底是给谁看的？",
          "answerExplanation": "活人进墓，不会长时间仰头看顶（甬道很矮）。而《葬书》里说，死者入殓后，灵魂会沿着墓道“升登”，从墓门穿过甬道进入前室。灵魂是飘着的。所以，甬道顶上的彩画，正是给那些“飘过去”的眼睛看的。生者看不见，鬼魂却刚好能看见——这个设计，精准得可怕。"
        }
      ]
    },
    {
      "id": "clue_puzzle_10",
      "puzzleNo": 10,
      "chapterKey": "front_chamber",
      "chapterTitle": "前室",
      "title": "前室像个小礼堂——“宴饮”是为了谁办的？",
      "corePuzzle": "从甬道一踏进前室，你的感觉不是“进了坟”，倒像是进了一个农村大户人家的堂屋——正前方是男女主人并排坐着，身后是一幅山水屏风；对面墙上一整队女乐在吹拉弹唱，还有人翩翩起舞。\n有人嘀咕：“人不是埋在后室吗？咋前室不摆棺材，摆上酒席了？这是想在坟里请客啊？”\n问题一： 前室这么开阔，还弄出男女主人坐镇、对面奏乐的场景——它到底是为谁准备的舞台？\n问题二： 把“家宴”画成壁画，和直接在葬礼上大摆宴席，是一个意思吗？如果是，说明什么问题？",
      "finalConclusion": "前室的宏伟布景和宴乐壁画，不是“装饰”，而是专门为死者灵魂准备的常设“死客厅”。赵家人相信，只要前室的酒席画面不褪色、音乐不停歇，死者在阴间就能像生前一样体面地应酬。这背后透露的信念是——钱，在哪儿都好使。",
      "docClues": [
        {
          "clueNo": 32,
          "docId": "M1_front_hall",
          "text": "前室长1.84米，宽2.28米，自砖地面至顶高3.85米。四壁转角砌倚柱，柱上砌阑额、普拍方、铺作，上有宝盖式盝顶藻井。",
          "recordIds": [
            "front_chamber:brick_table"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 33,
          "docId": "M1_front_hall_decoration",
          "text": "前室南北壁和东西壁皆满施彩画和壁画。其中西壁砖砌男女对坐像（即墓主人夫妇），正对东壁女乐表演区。",
          "recordIds": [
            "front_chamber:female_musicians"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 53,
          "docId": "Northern Wei_Fresco_Notes",
          "text": "报告指出，前室西壁和东壁的布置，组成了“墓主人夫妇开芳宴”的画面。这可能是北宋富豪阶层在丧礼中沿袭的唐代“厅前设乐、宴飨宾客”的葬俗。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "front_chamber:brick_table",
        "front_chamber:female_musicians"
      ],
      "referenceDocIds": [
        "Northern Wei_Fresco_Notes"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "前室这么开阔，还弄出男女主人坐镇、对面奏乐的场景——它到底是为谁准备的舞台？",
          "sourceText": "舞台的“观众”是灵魂。 前室不是给你活人开party用的（这里根本站不下几个人）。真正“坐在”男女主人位置上的，是死者已经离开身体的灵魂。他们端坐在桌前，身后是永远的山光水色，对面是永不停歇的歌舞伴奏——这是一个永恒化的“宴饮瞬间”。赵家请人画这场永不散场的酒席，是想让死者在阴间也能天天有人陪酒、陪乐。",
          "options": [
            {
              "text": "为死者灵魂准备的永恒“宴饮瞬间”，让死者在阴间天天有人陪酒陪乐",
              "correct": true
            },
            {
              "text": "给活人送葬时开party用的",
              "correct": false
            },
            {
              "text": "赵大翁生前喜欢听曲，死后也要继续享受",
              "correct": false
            }
          ],
          "question": "前室这么开阔，还弄出男女主人坐镇、对面奏乐的场景——它到底是为谁准备的舞台？",
          "answerExplanation": "前室不是给你活人开party用的（这里根本站不下几个人）。真正“坐在”男女主人位置上的，是死者已经离开身体的灵魂。他们端坐在桌前，身后是永远的山光水色，对面是永不停歇的歌舞伴奏——这是一个永恒化的“宴饮瞬间”。赵家请人画这场永不散场的酒席，是想让死者在阴间也能天天有人陪酒、陪乐。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "把“家宴”画成壁画，和直接在葬礼上大摆宴席，是一个意思吗？如果是，说明什么问题？",
          "sourceText": "地上丧葬模式的“地下翻版”。 报告引宋人笔记指出，北宋富豪家办丧事，常见“厅前设乐”的习俗——客人来了，一起吃喝看跳舞，把丧事办得像喜事一样热闹。M1前室西壁的墓主人坐像、东壁的女乐队列，就是把这种排场直接搬进了地下。这说明：在赵家人看来，死后世界的快乐标准，和活着完全一样——有钱就有酒，有酒就有乐，有乐才算好日子。",
          "options": [
            {
              "text": "画比真宴席省钱，赵家抠门",
              "correct": false
            },
            {
              "text": "壁画是随便画的，没有特别的意思",
              "correct": false
            },
            {
              "text": "是把地上丧葬模式“地下翻版”，说明赵家认为死后世界的快乐标准和活着完全一样",
              "correct": true
            }
          ],
          "question": "把“家宴”画成壁画，和直接在葬礼上大摆宴席，是一个意思吗？如果是，说明什么问题？",
          "answerExplanation": "报告引宋人笔记指出，北宋富豪家办丧事，常见“厅前设乐”的习俗——客人来了，一起吃喝看跳舞，把丧事办得像喜事一样热闹。M1前室西壁的墓主人坐像、东壁的女乐队列，就是把这种排场直接搬进了地下。这说明：在赵家人看来，死后世界的快乐标准，和活着完全一样——有钱就有酒，有酒就有乐，有乐才算好日子。"
        }
      ]
    },
    {
      "id": "clue_puzzle_11",
      "puzzleNo": 11,
      "chapterKey": "front_chamber",
      "chapterTitle": "前室",
      "title": "砖雕的墓主人像——为什么非要“冒出来”？",
      "corePuzzle": "前室其他壁画都是平贴在墙上的，唯独墓主人夫妇的像不一样——他们是“冒”出来的，凸出墙面好几厘米，像是从墙里面硬生生挤出来坐着。\n你用手背轻轻拂过那个砖砌的男主人头像，感觉很立体。而旁边的屏风、侍女、果盘，却都只是画在墙上的一层皮。\n问题一： 为什么其他人都“画”在墙上，偏偏墓主人要用砖“砌”出来？这能带来什么视觉或心理上的不同？\n问题二： 这种“主人3D，仆人2D”的做法，反映出匠人想达到什么目的？",
      "finalConclusion": "前室西壁的砖雕墓主人像，是一尊“灵魂座位”。它从墙面中凸出来，给了死去的主人一个可以在壁画中“真实出席”的位置。旁边的仆人全都画在平面上，只有主人“有体量”——这种材质分层，是工匠对“死者世界等级秩序”最直白的表达。",
      "docClues": [
        {
          "clueNo": 41,
          "docId": "M1_front_hall_fresco_west",
          "text": "前室西壁正中的男女主人像，不是画在墙上的，而是砖雕后浮出壁面5-10厘米。人物戴着蓝帽（男）、梳髻插簪（女），坐在圆脚椅上，中间有桌，桌上放注子和盏托。",
          "recordIds": [
            "front_chamber:brick_table"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 52,
          "docId": "religious_belief",
          "text": "报告注释(51)指出，这种将墓主人像“砖砌浮出”的做法，在北宋晚期的砖室墓中非常罕见——大部分墓葬的墓主人像都是平面的壁画，只有少数高度仿木构的高规格墓葬才使用砖雕凸出。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "front_chamber:brick_table"
      ],
      "referenceDocIds": [
        "religious_belief"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "为什么其他人都“画”在墙上，偏偏墓主人要用砖“砌”出来？这能带来什么视觉或心理上的不同？",
          "sourceText": "让死者获得“实体感”。 平面的壁画终归是“像”，而砖雕却是有厚度的、能触摸的“物”。把墓主人做成浮雕，等于在物理上给了他一个“立足之地”——他的灵魂可以随时坐回这张椅子上。报告引用一种推断：砖雕的墓主人像，可能被视为死者灵魂的“物质载体”或“傀儡”，让灵魂不至于飘散。",
          "options": [
            {
              "text": "砖雕比画画更便宜，省钱",
              "correct": false
            },
            {
              "text": "赵大翁长得太帅，平面画不出来",
              "correct": false
            },
            {
              "text": "砖雕有厚度和触感，给了死者灵魂一个“立足之地”和“物质载体”",
              "correct": true
            }
          ],
          "question": "为什么其他人都“画”在墙上，偏偏墓主人要用砖“砌”出来？这能带来什么视觉或心理上的不同？",
          "answerExplanation": "平面的壁画终归是“像”，而砖雕却是有厚度的、能触摸的“物”。把墓主人做成浮雕，等于在物理上给了他一个“立足之地”——他的灵魂可以随时坐回这张椅子上。报告引用一种推断：砖雕的墓主人像，可能被视为死者灵魂的“物质载体”或“傀儡”，让灵魂不至于飘散。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "这种“主人3D，仆人2D”的做法，反映出匠人想达到什么目的？",
          "sourceText": "刻意制造的“视觉等级”。 如果所有人都做成砖雕，那画面会失去重点；如果所有人都画成平面，那墓主人也无法突出。工匠用“砖雕vs壁画”的材质区别，创造出一种明确的主仆关系：主人有体积、有触感、是真实的；仆人是平面的、抽象的、可以随时被替换的。这种分层，也如实反映了当时社会对等级秩序的执着。",
          "options": [
            {
              "text": "仆人太多，一个个砌砖太麻烦",
              "correct": false
            },
            {
              "text": "用材质区别创造明确的主仆视觉等级，如实反映社会等级秩序",
              "correct": true
            },
            {
              "text": "工匠只会砌砖，不会画画",
              "correct": false
            }
          ],
          "question": "这种“主人3D，仆人2D”的做法，反映出匠人想达到什么目的？",
          "answerExplanation": "如果所有人都做成砖雕，那画面会失去重点；如果所有人都画成平面，那墓主人也无法突出。工匠用“砖雕vs壁画”的材质区别，创造出一种明确的主仆关系：主人有体积、有触感、是真实的；仆人是平面的、抽象的、可以随时被替换的。这种分层，也如实反映了当时社会对等级秩序的执着。"
        }
      ]
    },
    {
      "id": "clue_puzzle_12",
      "puzzleNo": 12,
      "chapterKey": "front_chamber",
      "chapterTitle": "前室",
      "title": "钱锭画在地上——为什么要在脚底下“撒钱”？",
      "corePuzzle": "你低头看向墓主人夫妇的脚下——椅子下面、脚踩的地方，地面上画了两三枚方头的长条形图案，叠成一个十字。旁边还有一枚椭圆的。\n旁边有个注释说：这是“金银铤”。\n有人笑道：“这也太实在了吧？画钱画在脚底板上，是怕死者不知道钱怎么花吗？”\n问题一： 为什么要把金银铤画在地上（而不是在桌上或墙上）？放这里有啥讲究？\n问题二： 画的只是“铤形物”（不是真金白银），说明当时的人对这种表现手法，持什么态度？",
      "finalConclusion": "画在墓主人脚下的金银铤，不是装饰，而是“压仓钱”。通过这种简单有效的绘画手段，赵家人向死者和阴间宣告：不给您摆几块真的，但画遍地的钱，够您花万万年。这是宋代商业社会中“钱能通神”观念的极致缩影——连死后世界的财富，都能用“画面”来兑现。",
      "docClues": [
        {
          "clueNo": 42,
          "docId": "M1_front_hall_fresco_west_details",
          "text": "男像脚床子前面的地上画两枚铤形物，相叠作十字状。男像椅下画一铤形物和一椭圆形物。女像椅下画一铤形物。",
          "recordIds": [
            "front_chamber:brick_table"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 43,
          "docId": "M1_front_hall_fresco_west_details2",
          "text": "报告引《佛说寿生经》扉图、《营造法式》金银铤彩画等，说明这些铤形物是仿当时流通的金银铤或银饼。",
          "recordIds": [
            "front_chamber:brick_table"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 44,
          "docId": "M1_front_hall_fresco_west_details3",
          "text": "桌下还画了一个黑色高瓶，承以黄色小座——不是实用器，更像是“镇宅”的宝瓶。",
          "recordIds": [
            "front_chamber:high_bottle"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "front_chamber:brick_table",
        "front_chamber:high_bottle"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "为什么要把金银铤画在地上（而不是在桌上或墙上）？放这里有啥讲究？",
          "sourceText": "脚下的钱，是“底气”。 把金银铤画在墓主人椅子脚边和脚踩的地方，这并不是随地乱画，而是一种象征性的财产公示——告诉所有“进入前室的目光”（包括神灵和其他鬼魂）：这位大人脚下踩的是金山银山，别想欺负他。这和活人家里把元宝压在门槛底下是一个道理。",
          "options": [
            {
              "text": "赵大翁有脚气，画钱是为了踩钱治病",
              "correct": false
            },
            {
              "text": "脚下的钱是“底气”和“压仓钱”，象征财产公示，告诉所有鬼魂别想欺负他",
              "correct": true
            },
            {
              "text": "地上空间大，可以画更多钱",
              "correct": false
            }
          ],
          "question": "为什么要把金银铤画在地上（而不是在桌上或墙上）？放这里有啥讲究？",
          "answerExplanation": "把金银铤画在墓主人椅子脚边和脚踩的地方，这并不是随地乱画，而是一种象征性的财产公示——告诉所有“进入前室的目光”（包括神灵和其他鬼魂）：这位大人脚下踩的是金山银山，别想欺负他。这和活人家里把元宝压在门槛底下是一个道理。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "画的只是“铤形物”（不是真金白银），说明当时的人对这种表现手法，持什么态度？",
          "sourceText": "画出来的钱，威力不输真的。 北宋时，许多墓葬会放置少量真钱或银铤作为陪葬。但M1却选择了“画”。这很妙——用画的方式，可以不受实际成本限制，画出来的钱“理论上”可以无限多。对赵家来说，花一笔钱请画工在墙脚挥两笔，就能让死者拥有取之不尽的财富，而不是只放几枚铜钱，这笔“性价比账”算得非常精明。",
          "options": [
            {
              "text": "画出来的钱“理论上”可以无限多，不受实际成本限制，性价比极高",
              "correct": true
            },
            {
              "text": "赵家太穷，买不起真金白银陪葬",
              "correct": false
            },
            {
              "text": "画工比金银匠便宜，所以选了画画",
              "correct": false
            }
          ],
          "question": "画的只是“铤形物”（不是真金白银），说明当时的人对这种表现手法，持什么态度？",
          "answerExplanation": "北宋时，许多墓葬会放置少量真钱或银铤作为陪葬。但M1却选择了“画”。这很妙——用画的方式，可以不受实际成本限制，画出来的钱“理论上”可以无限多。对赵家来说，花一笔钱请画工在墙脚挥两笔，就能让死者拥有取之不尽的财富，而不是只放几枚铜钱，这笔“性价比账”算得非常精明。"
        }
      ]
    },
    {
      "id": "clue_puzzle_13",
      "puzzleNo": 13,
      "chapterKey": "passage",
      "chapterTitle": "过道",
      "title": "过道里的“破子棂窗”——窗口通向哪里？",
      "corePuzzle": "过道是连接前室和后室的“走廊”。但你一走进来就发现：两边的墙上各开了一扇窗。窗户上竖着一根根砖做的“破子棂”，整齐得像今天老房子的木窗棂。\n怪了——这是一间地底下的墓室，往前是后室，往后是前室，四面都是砖墙。窗户外头是土，你开个窗能看见什么？\n问题一： 既然窗外根本不可能有风景，为什么在过道墙上有模有样地开两扇窗？\n问题二： 窗下的壁画画的是粮袋和粮罐——这扇“窗”搭配“仓库储备”，想表达什么？",
      "finalConclusion": "过道里的“破子棂窗”，是这个地下“豪宅”的精妙障眼法。窗是假的，窗后的“库房”也是画出来的——但正是这对假窗户，成功地把狭窄的过道“撑”成了一个带有厢房和仓库的完整院落。赵家人用一面墙、一个窗，就让死者拥有了一个“看不见的大宅院”。",
      "docClues": [
        {
          "clueNo": 56,
          "docId": "M1_corridor_window",
          "text": "过道东西二壁正中各砌一窗，组织为：上额、𣏢柱、窗额、立颊、腰串，内影作子桯，子桯之内竖砖作破子棂九枚。腰串下两端各砌出窗砧一枚。",
          "recordIds": [
            "passage:lattice_window"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 60,
          "docId": "M1_corridor_window2",
          "text": "壁面正中竖砖作破子棂窗。窗下右侧画黑色粮罐(?)，左侧有斜倚束扎上端的白色粮袋三，最前一袋袋面墨书“元符二年赵大翁布(?)”八字。",
          "recordIds": [
            "passage:inscription"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 93,
          "docId": "M1 outside wall details",
          "text": "过道两壁的破子棂窗全部刷染赭色。",
          "recordIds": [
            "tomb_gate:gate_structure_diagram_link"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "passage:lattice_window",
        "passage:inscription",
        "tomb_gate:gate_structure_diagram_link"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "既然窗外根本不可能有风景，为什么在过道墙上有模有样地开两扇窗？",
          "sourceText": "窗户不是用来看外面的，是用来“假装有外面”。 过道两侧有窗，但窗外是实实在在的生土。这个设计不是“通风采光”用的，而是视觉假象——让走在过道里的人（死者的灵魂），感觉自己正穿行在一座有院子、有厢房的宅第里，而不是一条狭窄的砖砌走廊。窗是“住宅感”的关键构件。",
          "options": [
            {
              "text": "窗户是视觉假象，让死者灵魂感觉自己正穿行在一座有院子、有厢房的宅第里",
              "correct": true
            },
            {
              "text": "为了通风采光",
              "correct": false
            },
            {
              "text": "工匠习惯开窗，走到哪开到哪",
              "correct": false
            }
          ],
          "question": "既然窗外根本不可能有风景，为什么在过道墙上有模有样地开两扇窗？",
          "answerExplanation": "过道两侧有窗，但窗外是实实在在的生土。这个设计不是“通风采光”用的，而是视觉假象——让走在过道里的人（死者的灵魂），感觉自己正穿行在一座有院子、有厢房的宅第里，而不是一条狭窄的砖砌走廊。窗是“住宅感”的关键构件。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "窗下的壁画画的是粮袋和粮罐——这扇“窗”搭配“仓库储备”，想表达什么？",
          "sourceText": "“窗前粮仓”是富裕的标配。 窗户打开，本应看到院子；但现在窗下画的是三个饱满的粮袋和一个大粮罐，袋上还写着“元符二年赵大翁布”。这是把仓库直接搬到了窗下。意思很明显：从窗口望出去，就是我赵家的粮仓。这是向任何人（或鬼魂）宣告：这家的储粮，够吃好几代。",
          "options": [
            {
              "text": "赵大翁生前是卖粮食的，这是他的职业纪念",
              "correct": false
            },
            {
              "text": "画粮袋是为了让灵魂有东西吃",
              "correct": false
            },
            {
              "text": "从窗口望出去就是我赵家的粮仓，向任何人宣告这家的储粮够吃好几代",
              "correct": true
            }
          ],
          "question": "窗下的壁画画的是粮袋和粮罐——这扇“窗”搭配“仓库储备”，想表达什么？",
          "answerExplanation": "窗户打开，本应看到院子；但现在窗下画的是三个饱满的粮袋和一个大粮罐，袋上还写着“元符二年赵大翁布”。这是把仓库直接搬到了窗下。意思很明显：从窗口望出去，就是我赵家的粮仓。这是向任何人（或鬼魂）宣告：这家的储粮，够吃好几代。"
        }
      ]
    },
    {
      "id": "clue_puzzle_14",
      "puzzleNo": 14,
      "chapterKey": "passage",
      "chapterTitle": "过道",
      "title": "窗下的“赵大翁布”——为什么把自己的名字写在粮袋上？",
      "corePuzzle": "你凑近了看那三个粮袋，最前面那个袋子上，清清楚楚写着八个字：“元符二年赵大翁布”。\n元符二年就是1099年，也就是这个墓的建造年份。赵大翁，就是墓主人本人。\n你忍不住乐了：有人会在自己家的米袋上，亲手写上“我家米袋”的吗？\n问题一： 赵大翁在粮袋上写名写姓写年份，他到底想防谁看？\n问题二： 这是个人炫富癖好，还是有更实际的丧葬功能？",
      "finalConclusion": "“元符二年赵大翁布”这七个字（加一个字），是赵大翁在阴间的“粮仓产权证”。他把自己名字和年份直接写在壁画上，等于给阴间地府的账房先生递了一张条子——这些粮，是我赵大翁的，谁也别动。这是一种极具宋代商业精神的“死后财产管理意识”。",
      "docClues": [
        {
          "clueNo": 60,
          "docId": "M1_corridor_window2",
          "text": "过道东壁窗下左侧画三个斜倚的白色粮袋，最前一袋袋面墨书“元符二年赵大翁布(?)”八字。",
          "recordIds": [
            "passage:inscription"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 84,
          "docId": "food_beverage",
          "text": "报告推测“布”字后或为“布帛”之“布”，但更可能是一种粮食名称或贮粮单位。也有学者认为“布”可能是“廪”之讹。",
          "recordIds": [
            "corridor:west_wall_wine_bottle"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 94,
          "docId": "Sort_ZhangJia",
          "text": "将主人姓名和年份直接写在仓库画面上，在同期壁画墓中非常罕见。",
          "recordIds": [],
          "referenceOnly": true
        }
      ],
      "requiredRecordIds": [
        "passage:inscription",
        "corridor:west_wall_wine_bottle"
      ],
      "referenceDocIds": [
        "Sort_ZhangJia"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "赵大翁在粮袋上写名写姓写年份，他到底想防谁看？",
          "sourceText": "画给“阴间审计官”看的财产证明。 在宋代人的观念中，人死后进入阴间，需要向阴司报到。届时，阳间带去的钱财、粮储需要“验明正身”。在粮袋上写明“元符二年赵大翁布”，就相当于写了一张物权凭证——证明这些粮食确实由赵大翁本人生前或家族准备的，别人抢不走，阴差也不敢乱扣。",
          "options": [
            {
              "text": "怕家里佣人偷粮食，写上名字做个记号",
              "correct": false
            },
            {
              "text": "赵大翁有强迫症，什么东西都要写名字",
              "correct": false
            },
            {
              "text": "写给“阴间审计官”看的财产证明，防止阴差乱扣或别人抢走",
              "correct": true
            }
          ],
          "question": "赵大翁在粮袋上写名写姓写年份，他到底想防谁看？",
          "answerExplanation": "在宋代人的观念中，人死后进入阴间，需要向阴司报到。届时，阳间带去的钱财、粮储需要“验明正身”。在粮袋上写明“元符二年赵大翁布”，就相当于写了一张物权凭证——证明这些粮食确实由赵大翁本人生前或家族准备的，别人抢不走，阴差也不敢乱扣。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "这是个人炫富癖好，还是有更实际的丧葬功能？",
          "sourceText": "这是“藏粮于画”的高明手段。 如果放真粮食在地宫里，几百年后一定会烂成灰。但画在墙上的粮袋，永远不会霉变、不会生虫。把名字和年份写上去，更让这份“阴间资产”具有了不可辩驳的时效性和所有权。赵家人对“死后世界的财产管理”，想得比活人还细致。",
          "options": [
            {
              "text": "当时流行在陪葬品上写名字，大家都这么做",
              "correct": false
            },
            {
              "text": "是“藏粮于画”的高明手段，画在墙上的粮袋永远不会霉变，写上名字让“阴间资产”具有不可辩驳的所有权",
              "correct": true
            },
            {
              "text": "纯粹是赵大翁爱炫富，想让别人知道他有钱",
              "correct": false
            }
          ],
          "question": "这是个人炫富癖好，还是有更实际的丧葬功能？",
          "answerExplanation": "如果放真粮食在地宫里，几百年后一定会烂成灰。但画在墙上的粮袋，永远不会霉变、不会生虫。把名字和年份写上去，更让这份“阴间资产”具有了不可辩驳的时效性和所有权。赵家人对“死后世界的财产管理”，想得比活人还细致。"
        }
      ]
    },
    {
      "id": "clue_puzzle_15",
      "puzzleNo": 15,
      "chapterKey": "passage",
      "chapterTitle": "过道",
      "title": "过道顶的“丁字盝顶”——为什么是“T”形？",
      "corePuzzle": "你仰头看前室和过道的顶部，发现一个很奇怪的形状：前室的顶是个标准的正方形“盝顶”，像个倒扣的方斗；而过道的顶是长方形的，像一条走廊。这两者连接在一起……组成了一个“丁”字形。\n站在下面的人抬头看，会感觉头顶的藻井像一个大写字母 “T” 。\n问题一： 为什么过道顶要“省去南斜面”，做成一个不对称的丁字形？是技术限制，还是故意为之？\n问题二： “丁字盝顶”的设计，给站在前室和过道里的人带来了什么不同的心理感受？",
      "finalConclusion": "“丁字盝顶”不是匠人偷懒省了一面，而是精心设计的空间统合术。它把前室和过道两个不同的建筑单元，无缝衔接到一个顶棚体系之下。从下面看上去，你会感觉整座墓室是一气呵成的——这种“视觉一体化”，正是为了让死者的灵魂觉得：这就是我的大宅，里里外外都是我的地盘。",
      "docClues": [
        {
          "clueNo": 59,
          "docId": "M1_corridor_ceiling",
          "text": "过道顶之制与前室同，但山花帐头之上内收三层。顶南面与前室顶北坡中部相连，省去盝顶的南斜面，形成“丁字盝顶”。",
          "recordIds": [
            "passage:ceiling_canopy"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 62,
          "docId": "M1_ceiling_type",
          "text": "过道顶与前室顶的“丁字”连接处，是匠人有意设计的结构美学，也是为了节省砖材并保证室顶的整体性。",
          "recordIds": [
            "passage:canopy_center"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "passage:ceiling_canopy",
        "passage:canopy_center"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "为什么过道顶要“省去南斜面”，做成一个不对称的丁字形？是技术限制，还是故意为之？",
          "sourceText": "这不是技术妥协，是视觉魔术。 如果过道顶也做成一个完整独立的“盝顶”，那它和前室顶之间会有一道明显的“接缝”，显得割裂。但现在，匠人把过道顶的南斜面直接“借用”了前室顶的北坡——两者融为一体，无缝连接成一个巨大的“双室一体”空间。从下面看，根本看不出前室和过道的分界线，只会感觉自己站在一个超级大宅的天花板下面。",
          "options": [
            {
              "text": "过道太窄，放不下完整的盝顶",
              "correct": false
            },
            {
              "text": "匠人有意设计的视觉魔术，把前室和过道融为一体，无缝连接成巨大的“双室一体”空间",
              "correct": true
            },
            {
              "text": "砖不够了，只能省一面",
              "correct": false
            }
          ],
          "question": "为什么过道顶要“省去南斜面”，做成一个不对称的丁字形？是技术限制，还是故意为之？",
          "answerExplanation": "如果过道顶也做成一个完整独立的“盝顶”，那它和前室顶之间会有一道明显的“接缝”，显得割裂。但现在，匠人把过道顶的南斜面直接“借用”了前室顶的北坡——两者融为一体，无缝连接成一个巨大的“双室一体”空间。从下面看，根本看不出前室和过道的分界线，只会感觉自己站在一个超级大宅的天花板下面。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "“丁字盝顶”的设计，给站在前室和过道里的人带来了什么不同的心理感受？",
          "sourceText": "“丁”字象征着贯通。 如果是“前后各一个独立顶”，那后室和前室就是分离的两个空间。但“丁字形”把两者“焊接”在一起，暗示着前后贯通、内外无阻——死者的灵魂可以毫无障碍地从前室的宴会区域，流通过道，进入后室的安寝区域。整个墓室，是一体化的“死后住宅”。",
          "options": [
            {
              "text": "暗示前后贯通、内外无阻，死者的灵魂可以毫无障碍地流通过道",
              "correct": true
            },
            {
              "text": "让人觉得墓室建歪了，工匠手艺不行",
              "correct": false
            },
            {
              "text": "T字形比较时髦，当时流行这种设计",
              "correct": false
            }
          ],
          "question": "“丁字盝顶”的设计，给站在前室和过道里的人带来了什么不同的心理感受？",
          "answerExplanation": "如果是“前后各一个独立顶”，那后室和前室就是分离的两个空间。但“丁字形”把两者“焊接”在一起，暗示着前后贯通、内外无阻——死者的灵魂可以毫无障碍地从前室的宴会区域，流通过道，进入后室的安寝区域。整个墓室，是一体化的“死后住宅”。"
        }
      ]
    },
    {
      "id": "clue_puzzle_16",
      "puzzleNo": 16,
      "chapterKey": "rear_chamber",
      "chapterTitle": "后室",
      "title": "六角形后室——为什么不是方的，非要弄成多边形？",
      "corePuzzle": "后室的形状很奇怪——它不是常见的四方或长方，而是一个 正六边形。你拿出卷尺量了量：六面墙长度差不多，几乎一样。\n你见过很多宋代墓室，绝大多数是方形或圆形，六边形的非常少见。有人猜：“可能是建的时候算错了尺寸，歪打正着吧？”\n可你一抬头——从底部的六边形，到顶部的六瓣攒尖，全都对齐了，显然是精心设计的。\n问题一： 把后室做成六边形，而不是方形或圆形，有什么特殊的意义？\n问题二： 从六边形的墙，到六瓣攒尖的顶——这种“六”遍全室的设计，背后藏着什么观念？",
      "finalConclusion": "后室的六边形不是“失误”，而是宋代高级仿木构藻井的直接移植。同时它与后室砖床上的“金井”共同形成一个完整的风水祈福系统。这六面墙，围起来的不仅是死者的安息之所，更是对“身后空间得吉得福”的一种执拗算账——从地到天，都被数字“六”牢牢锁住。",
      "docClues": [
        {
          "clueNo": 63,
          "docId": "M1_back_hall_structure",
          "text": "后室平面六角，内部每面长宽1.26—1.30米不等。自第一层砖床面至顶高2.6米。入口内为长55厘米、宽1.06米的扁方形地面。",
          "recordIds": [
            "rear_chamber:rear_wall_overview"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 66,
          "docId": "M1_back_hall_bracket",
          "text": "后室六壁的上层素方之上砌内收的随瓣方二层，方上砌转角铺作，两转角间砌补间铺作一朵，皆单抄单昂五铺作重栱计心造。",
          "recordIds": [
            "rear_chamber:rear_ceiling_small_bracket"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 67,
          "docId": "M1_back_hall_ceiling",
          "text": "铺作之上随瓣内收，砌出山花帐头和宝盖，并易盝顶为截头的六瓣攒尖顶。",
          "recordIds": [
            "rear_chamber:rear_ceiling_overview"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "rear_chamber:rear_wall_overview",
        "rear_chamber:rear_ceiling_small_bracket",
        "rear_chamber:rear_ceiling_overview"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "把后室做成六边形，而不是方形或圆形，有什么特殊的意义？",
          "sourceText": "六边形是多边形藻井的变体。 在宋代，方形或圆形墓室是最常见的。六边形（或八角形）多见于规格较高的木构藻井或佛塔。M1后室采用六边形，实际上是在当时流行的仿木构藻井基础上简化而成。报告注释提到，这种形制可能与宋代《营造法式》中描述的“斗六藻井”密切相关——它不是工匠随便拍脑门想出来的，而是有严格的匠作传承。",
          "options": [
            {
              "text": "六边形是仿木构藻井（“斗六藻井”）的直接移植，有严格的匠作传承",
              "correct": true
            },
            {
              "text": "工匠算错了尺寸，歪打正着",
              "correct": false
            },
            {
              "text": "六边形比较省砖，比方形省钱",
              "correct": false
            }
          ],
          "question": "把后室做成六边形，而不是方形或圆形，有什么特殊的意义？",
          "answerExplanation": "在宋代，方形或圆形墓室是最常见的。六边形（或八角形）多见于规格较高的木构藻井或佛塔。M1后室采用六边形，实际上是在当时流行的仿木构藻井基础上简化而成。报告注释提到，这种形制可能与宋代《营造法式》中描述的“斗六藻井”密切相关——它不是工匠随便拍脑门想出来的，而是有严格的匠作传承。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "从六边形的墙，到六瓣攒尖的顶——这种“六”遍全室的设计，背后藏着什么观念？",
          "sourceText": "“六”的数字密码。 六边形从几何上就暗示了“均匀”和“完满”。同时，在唐末宋初的堪舆理论中，墓室被区分为“八卦方位”，六边形正好可以容纳六甲八卦的布局（后室砖床上的小孔——“金井”便是明证）。因此，选择六边形不仅是审美追求，更是为了契合风水上的吉兆布局。",
          "options": [
            {
              "text": "赵大翁喜欢数字6，是他的幸运数字",
              "correct": false
            },
            {
              "text": "六边形比较稳固，不容易塌",
              "correct": false
            },
            {
              "text": "六边形暗示“均匀”和“完满”，契合风水上的六甲八卦吉兆布局",
              "correct": true
            }
          ],
          "question": "从六边形的墙，到六瓣攒尖的顶——这种“六”遍全室的设计，背后藏着什么观念？",
          "answerExplanation": "六边形从几何上就暗示了“均匀”和“完满”。同时，在唐末宋初的堪舆理论中，墓室被区分为“八卦方位”，六边形正好可以容纳六甲八卦的布局（后室砖床上的小孔——“金井”便是明证）。因此，选择六边形不仅是审美追求，更是为了契合风水上的吉兆布局。"
        }
      ]
    },
    {
      "id": "clue_puzzle_17",
      "puzzleNo": 17,
      "chapterKey": "rear_chamber",
      "chapterTitle": "后室",
      "title": "后室的“小铺作”——为什么上面的斗拱反而更复杂？",
      "corePuzzle": "你仰头看向后室的顶部——那里有一圈小斗拱，密密麻麻围成一圈。和下面的铺作比起来，这些小斗拱个头只有一半，但仔细看，它们的细节却比底下大堂的斗拱还丰富：它们有真正的慢栱（底下都没有），替木也做得很精致。\n有人挠挠头说：“上面那么高，谁会仔细看？搞这么复杂不是白费工吗？”\n但你注意到一个矛盾点：下面前室那么显眼的位置反而省了慢栱，上面这个旮旯里却做全了。\n问题一： 为什么顶上的小铺作，反而比下面的“大”铺作更讲究、更“对版”？\n问题二： 如果把下面看做“给活人看的演出”，那上面给谁看？",
      "finalConclusion": "放在高处的小铺作更好，可不是为了好看——它是一座标准化的“精品小木作”，作用是在死者灵魂升登的最高处迎接他。前室铺作是“社交面子”，后室小铺作是“灵魂礼遇”。这种上下颠倒的“精粗”差异，恰恰暴露了设计者的真实意图：墓室里最重要的观众，从来不是活人。",
      "docClues": [
        {
          "clueNo": 66,
          "docId": "M1_back_hall_bracket",
          "text": "后室六壁的上层素方之上砌内收的随瓣方二层，方上砌转角铺作，两转角间砌补间铺作一朵，皆单抄单昂五铺作重栱计心造。",
          "recordIds": [
            "rear_chamber:rear_ceiling_small_bracket"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 94,
          "docId": "Sort_ZhangJia",
          "text": "此部铺作虽远较下面的铺作为小，但其细部的相互比例则较其下面的乃至前室的铺作反为宽大，并设有替木和真正的慢栱。",
          "recordIds": [],
          "referenceOnly": true
        },
        {
          "clueNo": 125,
          "docId": "color_matching_detail",
          "text": "后室上部的小铺作不仅设有慢栱，其材分比例还更接近《营造法式》的规定，比前室的标准更“正宗”。",
          "recordIds": [
            "rear_chamber:rear_northwest_bracket_detail"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "rear_chamber:rear_ceiling_small_bracket",
        "rear_chamber:rear_northwest_bracket_detail"
      ],
      "referenceDocIds": [
        "Sort_ZhangJia"
      ],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "为什么顶上的小铺作，反而比下面的“大”铺作更讲究、更“对版”？",
          "sourceText": "小铺作是真正的“小木作”功底。 报告指出，M1前室铺作（“大”铺作）的材高为15厘米（第八等材），而后室顶部小铺作的材高更小。但恰恰是这套小铺作，在比例上更严格地遵照了《营造法式》——它拥有前室铺作所缺失的“真慢栱”。这说明：顶层小铺作的工匠，才是真正受过标准化训练的“内行人”。他们或许常年受雇于官式工程或高级寺庙造像，而前室的铺作可能由当地工艺稍逊的匠人完成。",
          "options": [
            {
              "text": "赵大翁喜欢小东西，越小越精致",
              "correct": false
            },
            {
              "text": "上面不容易被看到，工匠可以随便发挥",
              "correct": false
            },
            {
              "text": "顶层小铺作的工匠才是真正受过标准化训练的“内行人”，可能常年受雇于官式工程",
              "correct": true
            }
          ],
          "question": "为什么顶上的小铺作，反而比下面的“大”铺作更讲究、更“对版”？",
          "answerExplanation": "报告指出，M1前室铺作（“大”铺作）的材高为15厘米（第八等材），而后室顶部小铺作的材高更小。但恰恰是这套小铺作，在比例上更严格地遵照了《营造法式》——它拥有前室铺作所缺失的“真慢栱”。这说明：顶层小铺作的工匠，才是真正受过标准化训练的“内行人”。他们或许常年受雇于官式工程或高级寺庙造像，而前室的铺作可能由当地工艺稍逊的匠人完成。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "如果把下面看做“给活人看的演出”，那上面给谁看？",
          "sourceText": "顶部才是“神灵注视区”。 从生者的视角看，前室的铺作最显眼，是第一印象。但从“灵魂视角”看——死后灵魂是向上飘移的（尤其在佛道融合的宋代丧葬观中）。死者的灵魂会穿越前室的顶，上升到后室顶部的“宝盖”之上。所以，那颗最精致、最标准的小斗拱，不是给人看的，而是给死者上升途中的灵魂看的——越往高处越庄严，这才是最终的目的地。",
          "options": [
            {
              "text": "给盗墓贼看的，让他们知道这里很高级",
              "correct": false
            },
            {
              "text": "给死者上升途中的灵魂看的——越往高处越庄严，这才是最终的目的地",
              "correct": true
            },
            {
              "text": "给考古学家看的，让他们有东西研究",
              "correct": false
            }
          ],
          "question": "如果把下面看做“给活人看的演出”，那上面给谁看？",
          "answerExplanation": "从生者的视角看，前室的铺作最显眼，是第一印象。但从“灵魂视角”看——死后灵魂是向上飘移的（尤其在佛道融合的宋代丧葬观中）。死者的灵魂会穿越前室的顶，上升到后室顶部的“宝盖”之上。所以，那颗最精致、最标准的小斗拱，不是给人看的，而是给死者上升途中的灵魂看的——越往高处越庄严，这才是最终的目的地。"
        }
      ]
    },
    {
      "id": "clue_puzzle_18",
      "puzzleNo": 18,
      "chapterKey": "rear_chamber",
      "chapterTitle": "后室",
      "title": "后室北壁“妇人启门”——假门后面到底有什么？",
      "corePuzzle": "后室最显眼的装饰，就是北墙正中那个砖雕的假门。门是关着的，但左扇门——微微向里开了一条缝。\n门缝里，站着一个少女。她梳着两个发髻，穿着长裙，右手搭在门边，像是正要拉开门走出来。据说她原本脸上还画着胭脂，现在已经褪尽了。\n你盯着这道门缝看了好一会儿，心里浮起一个老问题：门后面到底有什么？这个女人是谁？\n问题一： 为什么宋代到元代，从四川到河北再到高丽，大家都这么爱在墓里刻一个“开门的女人”？\n问题二： 她是在“开门迎客”，还是在“关门拒客”？这对理解她的功能来说，有什么区别？",
      "finalConclusion": "后室北墙的“妇人启门”，是整个M1墓地空间游戏的“核弹级”机关。通过一扇微开的门、一个恭敬的少女，它暗示：这座地宫，并没有到此为止。砖墙外面是看不见的庭院、厅堂……无垠的彼岸空间就此打开。这个母题风靡数百年、纵横数千公里，靠的正是它对“想象力的无限激发”：看不见的，才是最大的。 而那个少女，永远站在门边，替赵大翁的灵魂招呼每一位访客。",
      "docClues": [
        {
          "clueNo": 68,
          "docId": "M1_back_hall_fresco_details",
          "text": "北壁上画绛幔、蓝绶，其下砖砌假门。假门外，面南立一砖雕的少女，垂双髻，着窄袖衫和长裙，裙下露尖鞋，右手作启门状。此砖雕少女原来敷有彩色，现已脱落。",
          "recordIds": [
            "rear_chamber:woman_door"
          ],
          "referenceOnly": false
        },
        {
          "clueNo": 75,
          "docId": "historical_writing_notes_6",
          "text": "报告注释(75)广泛引用了从唐代到金代、从四川到河北、甚至朝鲜半岛高丽铜镜上的“妇人启门”装饰，指出这是一种贯穿唐宋金元、覆盖广泛地域的丧葬母题。其核心寓意是“表示假门之后尚有庭院或房屋、厅堂，亦即表示墓室至此并未到尽头之意”。",
          "recordIds": [
            "rear_chamber:woman_hand"
          ],
          "referenceOnly": false
        }
      ],
      "requiredRecordIds": [
        "rear_chamber:woman_door",
        "rear_chamber:woman_hand"
      ],
      "referenceDocIds": [],
      "steps": [
        {
          "stepNo": 1,
          "label": "第一步",
          "prompt": "为什么宋代到元代，从四川到河北再到高丽，大家都这么爱在墓里刻一个“开门的女人”？",
          "sourceText": "门后是“未尽的宅院”。 报告注释明确指出，这种“妇人启门”的作用就是 “表示假门之后尚有空间”——它在视觉和心理上暗示，墓室的墙壁只是一道门，门后面还有院子、房子，或是另一个世界。这层空白，比任何壁画都更强大。因为现实中工匠无法真的在地下再建一座大宅，但通过这门缝、这半掩的少女，就让观者自己脑补出了“无尽空间”。",
          "options": [
            {
              "text": "门后面真的还有房间，少女是守门人",
              "correct": false
            },
            {
              "text": "“妇人启门”的作用是暗示假门之后尚有空间，让观者自己脑补出“无尽空间”",
              "correct": true
            },
            {
              "text": "当时流行这种装饰，跟风而已",
              "correct": false
            }
          ],
          "question": "为什么宋代到元代，从四川到河北再到高丽，大家都这么爱在墓里刻一个“开门的女人”？",
          "answerExplanation": "报告注释明确指出，这种“妇人启门”的作用就是 “表示假门之后尚有空间”——它在视觉和心理上暗示，墓室的墙壁只是一道门，门后面还有院子、房子，或是另一个世界。这层空白，比任何壁画都更强大。因为现实中工匠无法真的在地下再建一座大宅，但通过这门缝、这半掩的少女，就让观者自己脑补出了“无尽空间”。"
        },
        {
          "stepNo": 2,
          "label": "第二步",
          "prompt": "她是在“开门迎客”，还是在“关门拒客”？这对理解她的功能来说，有什么区别？",
          "sourceText": "她不是主人，是“迎宾员”。 从发饰和衣着看，这少女梳着垂双髻——这是唐代至宋代未出嫁的年轻侍女（丫鬟）的典型发饰。她不是女主人，也不是鬼怪，而是负责“开门迎候”的引导者。她的工作，就是替墓主人灵魂和前来探访的神灵或亲友开门。她是阴界宅院的“迎宾小姐”。",
          "options": [
            {
              "text": "她是“迎宾员”，替墓主人灵魂和前来探访的神灵或亲友开门",
              "correct": true
            },
            {
              "text": "她在关门拒客，不让外人进去",
              "correct": false
            },
            {
              "text": "她被困在门里，想出来却出不来",
              "correct": false
            }
          ],
          "question": "她是在“开门迎客”，还是在“关门拒客”？这对理解她的功能来说，有什么区别？",
          "answerExplanation": "从发饰和衣着看，这少女梳着垂双髻——这是唐代至宋代未出嫁的年轻侍女（丫鬟）的典型发饰。她不是女主人，也不是鬼怪，而是负责“开门迎候”的引导者。她的工作，就是替墓主人灵魂和前来探访的神灵或亲友开门。她是阴界宅院的“迎宾小姐”。"
        }
      ]
    }
  ],
  "chapterCards": [
    {
      "id": "chapter_environment",
      "chapterKey": "environment",
      "chapterNo": 1,
      "title": "墓外环境章节结论卡",
      "chapterTitle": "墓外环境",
      "objectiveClues": "1. 墓地位于河南禹县白沙镇北谷地，三面环山，前临颍水。 2. 北宋时属西京洛阳，为洛阳至许昌交通要冲，周边有冶铁和瓷窑。 3. 三座宋墓（M1、M2、M3）呈“丙、壬、甲”方位排列，符合“贯鱼葬”格局。",
      "conclusion": "历史信息：北宋《地理新书》定义此地为“上吉之地”。白沙因其交通与手工业是商业重镇。文献《地理新书》记载五姓（赵属角音）茔地“贯鱼葬”的昭穆排列法。 推测结论：墓主赵家非普通农民，而是财力雄厚的富商或地主。墓地位置既是风水宝地，也是其财富与社会地位的“地标”。三墓的排列是严格的家族墓地法典式布局，证明了第一号墓（M1）为家族祖坟，其他墓为后代子孙。",
      "requiredClueCardIds": [
        "clue_puzzle_01",
        "clue_puzzle_02",
        "clue_puzzle_03"
      ]
    },
    {
      "id": "chapter_tomb_gate",
      "chapterKey": "tomb_gate",
      "chapterNo": 2,
      "title": "墓门章节结论卡",
      "chapterTitle": "墓门",
      "objectiveClues": "1. M1墓门通高3.68米，为砖砌仿木构门楼，由基座、倚柱、阑额、普拍方、斗拱（单抄单昂重栱五铺作）、椽飞、瓦脊等组成。 2. 斗拱材高15cm（相当于《营造法式》第八等材）。 3. 门簪正面方形雕蒂形，背面为扁方形。铺作令栱较泥道栱短。 4. 彩画用赭、青、白三色（属“解绿结华装”），绘有叠胜、柿蒂、卷草纹。",
      "conclusion": "历史信息：宋制“非品官毋得起门屋、施重栱”。第八等材常用于“殿内藻井”。唐代至北宋，令栱从短变长，门簪从方变圆。彩画制度《营造法式》有详细等级划分。 推测结论：墓门形制是明显的“僭越”行为。赵大翁以平民之身，在礼制红线上玩弄极限，用的是“小木作”技法而非官式“大木作”。这暴露了墓主“有钱就任性”的商人本色。门簪和斗拱的形态细节，成为墓葬断代的铁证。彩画用“解绿结华装”而非“五彩遍装”，体现了既想显摆又不敢完全触碰皇权的复杂心态，是为“高明的低调”。",
      "requiredClueCardIds": [
        "clue_puzzle_04",
        "clue_puzzle_05",
        "clue_puzzle_06"
      ]
    },
    {
      "id": "chapter_corridor",
      "chapterKey": "corridor",
      "chapterNo": 3,
      "title": "甬道章节结论卡",
      "chapterTitle": "甬道",
      "objectiveClues": "1. 东西两壁各绘有一扇版门，上有门钉和门环，门下留空4.5cm，符合“断砌门”特征。 2. 壁画内容为人物牵马、捧物、荷钱贯，其中一人捧黑瓶，上墨书“画上崔大郎酒”。 3. 顶部彩画为赭色底绘赭黄两色的“叠胜”纹。",
      "conclusion": "历史信息：《营造法式》载“断砌门”用于车马通行处，门下不设地栿。 “叠胜”纹在宋代建筑中寓意“连环不断、子孙昌盛”。 “画上崔大郎酒”为品牌名。 推测结论：甬道壁画是赵大翁生前的“人情往来账本”，记录了来送礼吊唁的商户与亲友，是北宋商业社会的微观缩影。门下留空是为死者灵魂提供“无障碍通道”。顶部的“叠胜”纹是死者灵魂的“护身符”，象征打通生死关、家族兴旺，且是专为“飘着走的灵魂”设计的。",
      "requiredClueCardIds": [
        "clue_puzzle_07",
        "clue_puzzle_08",
        "clue_puzzle_09"
      ]
    },
    {
      "id": "chapter_front_chamber",
      "chapterKey": "front_chamber",
      "chapterNo": 4,
      "title": "前室章节结论卡",
      "chapterTitle": "前室",
      "objectiveClues": "1. 平面近方形，设有宝盖式盝顶藻井。 2. 西壁为砖雕突起的墓主人夫妇对坐宴饮像，东壁绘十一人女乐表演“开芳宴”。 3. 夫妇像为砖砌浮出墙壁5-10cm，其余人、物皆为平面壁画。 4. 桌椅下和脚边地上绘有金银铤（十字相叠）。",
      "conclusion": "历史信息：此场景为宋代富豪家“厅前设乐”的葬俗。砖雕墓主像是在高规格仿木构墓中才有的“灵魂载体”。金银铤为宋代流通货币，常出现在《营造法式》彩画图样中。 推测结论：前室是为死者灵魂准备的“死客厅”，一场永不散场的酒席。用砖砌墓主像，而仆人用平面壁画，是为了制造“主人3D，仆人2D”的视觉等级。地上的金银铤是“压仓钱”，用绘画代替实物，以画代财，告诉阴间：赵家不缺钱。",
      "requiredClueCardIds": [
        "clue_puzzle_10",
        "clue_puzzle_11",
        "clue_puzzle_12"
      ]
    },
    {
      "id": "chapter_passage",
      "chapterKey": "passage",
      "chapterNo": 5,
      "title": "过道章节结论卡",
      "chapterTitle": "过道",
      "objectiveClues": "1. 连接前、后室的短廊。东西壁各有一扇“破子棂窗”。 2. 窗下壁画有粮袋和粮罐，粮袋上墨书“元符二年赵大翁布（？）”。 3. 过道顶与前室顶相连，构成“丁字盝顶”。",
      "conclusion": "历史信息：“破子棂窗”是宅院的典型构件。将人名、年份写于壁画在同期墓中罕见。 推测结论：窗户是“视觉假象”，让狭窄过道显得像有厢房、院子的豪宅。粮袋上的题字是赵大翁在阴间的“粮仓产权证”，防止阴差错拿或侵占。 “丁字盏顶”是高超的空间统合术，将前、后室视觉上融为一体，暗示墓主人的灵魂可以在此宅邸中畅通无阻。",
      "requiredClueCardIds": [
        "clue_puzzle_13",
        "clue_puzzle_14",
        "clue_puzzle_15"
      ]
    },
    {
      "id": "chapter_rear_chamber",
      "chapterKey": "rear_chamber",
      "chapterNo": 6,
      "title": "后室章节结论卡",
      "chapterTitle": "后室",
      "objectiveClues": "1. 平面为正六边形，顶为六瓣攒尖顶。 2. 上部“小铺作”虽尺寸小，但比例更规范，设有真慢栱，比前室铺作更标准。 3. 北壁为“妇人启门”砖雕，一少女作开门状。 4. 砖床正中有孔（“金井”）下通生土。",
      "conclusion": "历史信息：六边形墓室是仿木构藻井（“斗六”）的移植。宋代堪舆学有八卦方位与金井（穴）之说。 “妇人启门”是唐宋以来广泛流行的丧葬母题，暗示门后别有空间。 推测结论：六边形墓室从结构到数字“六”都契合风水吉兆。顶部更标准的“小铺作”是给向上飞升的灵魂看的，代表“越往高处越庄严”。 “妇人启门”是整个地宫空间游戏的核心，通过一扇微开的门，激发无穷想象，暗示墓穴并未到头，远处仍有庭院。砖床下的“金井”是风水实践的直接证据，用于安放“吉土”，保佑子孙。",
      "requiredClueCardIds": [
        "clue_puzzle_16",
        "clue_puzzle_17",
        "clue_puzzle_18"
      ]
    }
  ]
};

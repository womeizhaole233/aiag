(function () {
const SAVE_KEY = "m1-analysis-rebuild-state-v1";
const START_SCENE_ID = "environment";
const POSITION_MAP = {
  image: {
    src: "assets/M1/00_墓葬全景与结构图/第一墓室剖面结构图.png",
    alt: "第一墓室剖面结构图"
  },
  hotspot: {
    id: "open_position_map",
    label: "查看位置",
    navLabel: "查看位置",
    shape: "rect",
    rect: [0.015, 0.02, 0.18, 0.13],
    title: "查看位置",
    sourceFile: "game-navigation",
    sourceClueId: "NAV",
    mapAction: "open"
  },
  markers: {
    tomb_gate: {
      label: "墓门",
      x: 0.17,
      y: 0.76
    },
    corridor: {
      label: "甬道",
      x: 0.34,
      y: 0.67
    },
    front_chamber: {
      label: "前室",
      x: 0.55,
      y: 0.55
    },
    passage: {
      label: "过道",
      x: 0.71,
      y: 0.51
    },
    rear_chamber: {
      label: "后室",
      x: 0.84,
      y: 0.5
    }
  },
  viewLabels: {
    environment: "墓外 / 白沙宋墓位置",
    environment_map: "墓外 / 白沙宋墓地形图",
    environment_sequence: "墓外 / M1空间序列",
    environment_outer_gate: "墓外 / 第一号墓外围",
    tomb_gate: "墓门 / 面向墓门",
    tomb_gate_main: "墓门 / 面向墓门",
    tomb_gate_outer: "墓门 / 外围位置",
    tomb_gate_lintel_back: "墓门 / 门额背面彩画",
    tomb_gate_brick_structure: "墓门 / 封门砖组织",
    corridor: "甬道 / 面向前室方向",
    corridor_roof_pattern_closeup: "甬道 / 顶部叠胜彩画近景",
    corridor_overview: "甬道 / 总交互视角",
    corridor_roof_view: "甬道 / 抬头看顶部",
    corridor_east_wall: "甬道 / 面向东壁",
    corridor_west_wall: "甬道 / 面向西壁",
    passage_overview: "过道 / 轴线总览",
    passage_rear_entry_closeup: "过道 / 后室入口近景",
    passage_main: "过道 / 面向东壁",
    passage_inscription_closeup: "过道 / 纪年题记近景",
    passage_lattice_closeup: "过道 / 破子棂窗近景",
    passage_canopy_closeup: "过道 / 抬头看顶部宝盖",
    front_overview: "前室 / 入口总览",
    front_west: "前室 / 面向西壁",
    front_east: "前室 / 面向东壁",
    front_south: "前室 / 面向南壁",
    front_north_west: "前室 / 面向北壁西部",
    front_north_east: "前室 / 面向北壁东部",
    front_ceiling: "前室 / 西北角顶部",
    front_ceiling_northwest_closeup: "前室 / 补间铺作近景",
    front_south_east_niche_closeup: "前室 / 南壁东部壁函近景",
    front_south_west_niche_closeup: "前室 / 南壁西部壁函近景",
    front_south_column_closeup: "前室 / 南壁倚柱彩画近景",
    front_west_bottle_closeup: "前室 / 西壁高瓶近景",
    front_west_entry_closeup: "前室 / 西壁入口关系",
    front_west_table_closeup: "前室 / 西壁砖砌桌近景",
    front_east_shoes_closeup: "前室 / 东壁尖鞋近景",
    front_west_ewer_closeup: "前室 / 西壁注子近景",
    rear_overview: "后室 / 入口总览",
    rear_north: "后室 / 面向北壁",
    rear_woman_closeup: "后室 / 妇人启门近景",
    rear_land_deed_closeup: "后室 / 砖床地券近景",
    rear_bones_nails_closeup: "后室 / 人骨与铁钉近景",
    rear_distribution_closeup: "后室 / 出土物分布图",
    rear_south: "后室 / 面向南壁",
    rear_south_high_table_closeup: "后室 / 南壁高几近景",
    rear_southwest: "后室 / 西南壁陈设组合图",
    rear_southwest_mirror_closeup: "后室 / 西南壁镜台近景",
    rear_southwest_basin_stand_closeup: "后室 / 西南壁曲足盆架近景",
    rear_southwest_stool_closeup: "后室 / 西南壁杌近景",
    rear_northeast: "后室 / 面向东北壁",
    rear_northeast_lamp_closeup: "后室 / 东北壁灯菜近景",
    rear_northeast_bracket_closeup: "后室 / 东北隅小铺作近景",
    rear_northwest: "后室 / 面向西北壁",
    rear_northwest_scissors_iron_closeup: "后室 / 西北壁剪刀熨斗近景",
    rear_northwest_pigment_closeup: "后室 / 西北壁颜料层位近景",
    rear_northwest_bracket_closeup: "后室 / 西北壁小斗栱近景",
    rear_ceiling: "后室 / 抬头看顶部",
    rear_ceiling_intermediate_bracket_closeup: "后室 / 补间铺作近景",
    rear_ceiling_small_bracket_closeup: "后室 / 室顶小铺作近景"
  }
};

const SCENES = {
  environment: {
    id: "environment",
    title: "墓外环境",
    startViewId: "environment_map",
    views: {
      environment_map: {
        id: "environment_map",
        title: "白沙宋墓地形图",
        image: {
          src: "assets/M1/01环境地图/白沙宋墓地形图.png",
          alt: "白沙宋墓地形图",
          width: 2304,
          height: 1728
        },
        hotspots: [
          {
            id: "baisha_location",
            label: "白沙宋墓地图",
            shape: "rect",
            rect: [0.12, 0.18, 0.54, 0.62],
            title: "一张泛黄的地图",
            body: "地图画面虽已模糊，但仍能清晰看到，\n墓葬位于河南省禹县（今禹州市）白沙镇北的一片谷地中，三面环山，前临颍水，乃上吉之地。",
            record: "墓葬位于河南省禹县白沙镇北的一片谷地中，\n三面环山，前临颍水，乃上吉之地。\n北宋时这里属于西京洛阳管辖。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓外环境线索精修版_v1.0.md",
            sourceClueId: "ENV-E-02"
          },
          {
            id: "m1_sequence_map",
            label: "M1空间序列",
            navLabel: "好像还有一张图....?",
            shape: "rect",
            rect: [0.58, 0.18, 0.95, 0.72],
            title: "平剖面线索",
            body: "M1是前后双室墓，由墓门、甬道、前室、过道、后室五部分组成",
            record: "前后双室墓葬，可以沿墓门、甬道、前室、过道进入后室。",
            sourceFile: "docs/handoff/线索交付文档/05_剧情体验交付/M1场景线索体验节奏表_v1.0.md",
            sourceClueId: "ENV-P0-01",
            viewTransition: {
              targetViewId: "environment_sequence",
              title: "查看新的手稿图",
              body: "这似乎是一张墓葬剖面图，可以带来怎样的信息呢....?",
              closeLabel: "查看"
            }
          },
          {
            id: "approach_tomb_gate",
            label: "前往墓门",
            navLabel: "前往墓门",
            shape: "rect",
            rect: [0.34, 0.72, 0.72, 0.98],
            title: "前往第一号墓",
            body: "确认白沙位置和M1空间顺序后，可以进入第一号墓墓门区域。",
            record: "墓外环境观察完成后，调查路径转向第一号墓墓门。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "tomb_gate",
              targetViewId: "tomb_gate_main",
              unlocked: true,
              completesSceneId: "environment",
              title: "前往墓门",
              body: "你放下地图，转到第一号墓墓门前。",
              closeLabel: "前往",
              lockedBody: "进入墓门前，先把墓外位置和 M1 空间序列确认下来。",
              missingRecords: [
                { id: "environment:baisha_location", label: "白沙宋墓位置" },
                { anyOf: ["environment:m1_sequence_map", "environment:six_part_sequence"], label: "M1 空间序列" }
              ]
            }
          }
        ]
      },
      environment_sequence: {
        id: "environment_sequence",
        title: "第一号墓平剖面",
        image: {
          src: "assets/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
          alt: "第一号墓平剖面图",
          width: 2560,
          height: 1440
        },
        hotspots: [
          {
            id: "six_part_sequence",
            label: "似乎是一张手绘稿",
            shape: "rect",
            rect: [0.18, 0.2, 0.82, 0.76],
            title: "绘图手稿",
            body: "你找到一张绘图手稿，上面精确勾勒出一个砖砌的拱形门廊结构。\n左侧是完整的拱门立面，可见砖砌的拱券、木质门楣和双扇木门；\n右侧剖开的墙体则露出了内部的阶梯状承重结构。",
            record: "绘图手稿，呈现出砖砌拱形墓门与周围土层的空间关系。左侧是完整的拱门立面，可见砖砌的拱券、木质门楣和双扇木门；\n右侧剖开的墙体则露出了内部的阶梯状承重结构。",
            sourceFile: "docs/handoff/线索交付文档/05_剧情体验交付/M1场景线索体验节奏表_v1.0.md",
            sourceClueId: "ENV-P0-01"
          },
          {
            id: "view_outer_gate",
            label: "墓门外围",
            navLabel: "查看外围",
            shape: "rect",
            rect: [0.04, 0.7, 0.28, 0.98],
            title: "墓门外围",
            body: "从墓室外看墓门，可以清晰地看到墓门外层封门砖由横砖和菱角牙子混砌。",
            record: "墓门外层封门砖由横砖和菱角牙子混砌",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
            sourceClueId: "GATE-E-01",
            viewTransition: {
              targetViewId: "environment_outer_gate",
              title: "查看墓门外围",
              body: "来到一号墓外围。",
              closeLabel: "查看"
            }
          },
          {
            id: "return_environment_map",
            label: "返回地形图",
            navLabel: "返回地形图",
            shape: "rect",
            rect: [0, 0.84, 0.24, 1],
            title: "返回地形图",
            body: "回到白沙宋墓地形图，重新确认墓址外部关系。",
            record: "返回白沙宋墓地形图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "environment_map",
              title: "返回地形图",
              body: "视角回到白沙宋墓地形图。",
              closeLabel: "返回"
            }
          }
        ]
      },
      environment_outer_gate: {
        id: "environment_outer_gate",
        title: "第一号墓外围",
        image: {
          src: "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
          alt: "第一号墓葬外围修改版",
          width: 4693,
          height: 3520
        },
        hotspots: [
          {
            id: "outer_gate_relation",
            label: "墓门外围",
            shape: "rect",
            rect: [0.16, 0.12, 0.84, 0.78],
            title: "对墓室外进行观测",
            body: "墓门外侧有一片平坦区域，其北端直抵墓门基座。\n墓道两侧壁并非完全平行，而是愈北愈宽。",
            record: "墓门外的平坦区域北抵墓门基座，墓道两边侧壁愈北愈宽。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
            sourceClueId: "GATE-E-01"
          },
          {
            id: "enter_tomb_gate_from_outer",
            label: "进入墓门",
            navLabel: "进入墓门",
            shape: "rect",
            rect: [0.34, 0.68, 0.68, 0.98],
            title: "进入墓门",
            body: "从外围进入墓门",
            record: "从外围进入第一号墓墓门。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "tomb_gate",
              targetViewId: "tomb_gate_main",
              unlocked: true,
              completesSceneId: "environment",
              title: "进入墓门",
              body: "墓门正面进入视野，可仔细观察门额、封门砖和门洞",
              closeLabel: "进入",
              lockedBody: "进入墓门前，先确认好墓外位置和 墓葬空间序列。",
              missingRecords: [
                { id: "environment:baisha_location", label: "白沙宋墓位置" },
                { anyOf: ["environment:m1_sequence_map", "environment:six_part_sequence"], label: "M1 空间序列" }
              ]
            }
          },
          {
            id: "return_sequence_from_outer",
            label: "查看手稿图",
            navLabel: "查看手稿图",
            shape: "rect",
            rect: [0, 0.82, 0.24, 1],
            title: "查看手稿图",
            body: "回到空间序列图，重新确认墓门在整体轴线中的位置。",
            record: "返回M1空间序列图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "environment_sequence",
              title: "查看手稿图",
              body: "M1是前后双室墓，由墓门、甬道、前室、过道、后室五部分组成。",
              closeLabel: "返回"
            }
          }
        ]
      }
    }
  },
  tomb_gate: {
    id: "tomb_gate",
    title: "第一号墓墓门",
    startViewId: "tomb_gate_main",
    views: {
      tomb_gate_main: {
        id: "tomb_gate_main",
        title: "第一号墓墓门",
        image: {
          src: "assets/M1/02墓道与墓门/第一号墓墓门_关闭门扇.png",
          alt: "第一号墓墓门关闭状态",
          width: 4693,
          height: 3520
        },
        hotspots: [
          {
            id: "return_environment",
            label: "返回墓外",
            navLabel: "返回墓外",
            shape: "rect",
            rect: [0.02, 0.78, 0.24, 0.98],
            title: "返回墓外环境",
            body: "返回墓外环境，重新确认墓外环境和位置信息。",
            record: "返回墓外环境复查。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "environment",
              targetViewId: "environment_outer_gate",
              unlocked: true,
              title: "返回墓外",
              body: "来到墓外。",
              closeLabel: "返回"
            }
          },
          {
            id: "lintel",
            label: "墓门门额",
            shape: "rect",
            rect: [0.37, 0.14, 0.63, 0.31],
            title: "墓门门额",
            body: "你将目光投向墓门最上方，那块横跨门洞的门额。\n门额正面雕出两枚方形门簪，面部浮雕四瓣蒂形装饰。\n砖上满刷白土，上绘彩画，但因被填土所掩，刷洗后大部漫漶。\n门额背面两端墨画流云、双禽，中绘牡丹。",
            record: "门额结构与质地：\n两枚方形门簪：门额正面雕出两枚方形门簪，面部浮雕四瓣蒂形装饰。\n背面彩画内容：两端流云、双禽，中央牡丹。\n立颊与上额：门额两侧为立颊，上方为上额及榑柱，皆绘墨画卷草。\n质地：全部为砖制，表面刷白土后施彩画，非木质。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "L07",
            viewTransition: {
              targetViewId: "tomb_gate_lintel_back",
              title: "查看门额背面彩画",
              body: "查看背面彩画信息",
              closeLabel: "查看"
            }
          },
          {
            id: "lintel_back",
            label: "门额上方建筑",
            shape: "rect",
            rect: [0.39, 0.07, 0.61, 0.17],
            title: "门额上方建筑",
            body: "仿木门楼上方飞檐椽之上是列砖制的瓯瓦，共十三陇。瓦下端并附雕素面圆瓦当。瓯瓦、瓯瓦上端叠涩五层横砖作门脊，是为墓门的最上部。",
            record: "门额背面两端墨画流云、双禽，中绘牡丹。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "L07",
            viewTransition: {
              targetViewId: "tomb_gate_lintel_back",
              title: "查看门额背面彩画",
              body: "查看门额背面彩画近景。",
              closeLabel: "查看"
            }
          },
          {
            id: "brick_seam",
            label: "封门砖缝",
            shape: "rect",
            rect: [0.28, 0.39, 0.43, 0.76],
            title: "查看封门砖缝",
            body: "你蹲在墓门前，仔细观察被封门砖封闭的入口。\n这些砖并非随意堆砌，而是有着严密的组织方式。\n外层由横砖与菱角牙子相混砌起。中层全部用横砖。\n内层全部用卧丁砖。",
            record: "封门砖外层横砖与菱角牙子相混砌起。中层全部用横砖。内层全部用卧丁砖。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "H01",
            viewTransition: {
              targetViewId: "tomb_gate_brick_structure",
              title: "查看封门砖组织",
              body: "三层封门砖：外层“横砖与菱角牙子相混”，中层“全部用横砖”，内层“全部用卧丁砖”。",
              closeLabel: "查看"
            }
          },
          {
            id: "door_opening",
            label: "关闭墓门",
            navLabel: "打开墓门",
            shape: "rect",
            rect: [0.44, 0.36, 0.56, 0.8],
            title: "关闭的墓门",
            body: "中间门框内仍闭合着赭色门扇，门钉和门环提示它是一道真正可开启的门，而不是已经通开的门洞。\n进入甬道前，墓门必须先被打开。",
            record: "墓门正面有门框与闭合门扇；进入前不可直接看到甬道内部。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "S02-TRANSITION",
            transition: {
              targetSceneId: "corridor",
              targetViewId: "corridor_overview",
              title: "打开墓门，进入甬道",
              body: "墓门打开后，甬道顶部压低。\n光线沿砖缝向内收窄，前方可以继续观察。",
              closeLabel: "进入",
              lockedBody: "墓门仍然闭合。\n入口记录尚未整理完整。",
              missingRecords: [
                { puzzleId: "mg_dig_match3", label: "墓门前清理", missingText: "点击关闭的墓门先完成挖土消消乐，移开门前浮土、碎砖和杂物。" },
                { id: "tomb_gate:lintel_back", label: "门额背面彩画" },
                { sceneId: "tomb_gate", minCount: 3, label: "墓门区域至少三条观察记录" }
              ]
            }
          },
          {
            id: "left_wall",
            label: "甬道西壁",
            shape: "rect",
            rect: [0.05, 0.28, 0.25, 0.72],
            title: "左侧土墙",
            body: "你站在墓门外，面朝封门砖，左手边（东侧）是墓道的侧壁。生土壁，未经砖砌或粉刷，保留了下葬时挖掘的原始土面。",
            record: "墓门前的生土壁，未经砖砌或粉刷，保留了下葬时挖掘的原始土面。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "E01"
          },
          {
            id: "threshold",
            label: "门前地面",
            shape: "rect",
            rect: [0.32, 0.79, 0.68, 0.96],
            title: "门前地面",
            body: "近墓门北端右侧有18片灰胎白瓷碗碎片，南端左侧有一个白瓷碗。\n两处白瓷碗呈对角线分布、一碎一全。",
            record: "近墓门北端右侧有18片灰胎白瓷碗碎片，南端左侧有一个白瓷碗。\n两处白瓷碗呈对角线分布、一碎一全。。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "ENV-S02",
            viewTransition: {
              targetViewId: "tomb_gate_outer",
              title: "查看墓门外环境",
              body: "墓门前的遗迹现象与墓门外是否有所联系？",
              closeLabel: "查看"
            }
          }
        ]
      },
      tomb_gate_outer: {
        id: "tomb_gate_outer",
        title: "第一号墓外围",
        image: {
          src: "assets/M1/02墓道与墓门/第一号墓葬外围修改版.png",
          alt: "第一号墓葬外围修改版",
          width: 4693,
          height: 3520
        },
        hotspots: [
          {
            id: "gate_outer_context",
            label: "外围与门前关系",
            shape: "rect",
            rect: [0.12, 0.12, 0.88, 0.78],
            title: "外围与门前关系",
            body: "你站在墓穴外围，俯瞰整座第一号墓的布局。\n墓道、墓门前平坦部分和墓门三者之间，构成了一条清晰的“入口轴线”。",
            record: "第一号墓外围图显示墓外环境与墓门入口之间的过渡关系。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
            sourceClueId: "GATE-E-01"
          },
          {
            id: "return_tomb_gate_from_outer",
            label: "返回墓门",
            navLabel: "返回墓门",
            shape: "rect",
            rect: [0, 0.82, 1, 1],
            title: "返回墓门",
            body: "返回墓门主视图继续观察门额、封门砖和门洞。",
            record: "返回墓门主视图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "tomb_gate_main",
              title: "返回墓门",
              body: "视角回到墓门正面。",
              closeLabel: "返回"
            }
          }
        ]
      },
      tomb_gate_lintel_back: {
        id: "tomb_gate_lintel_back",
        title: "墓门门额背面彩画",
        image: {
          src: "assets/M1/02墓道与墓门/插图三九 第一号墓墓门门额背面彩画.png",
          alt: "第一号墓墓门门额背面彩画",
          width: 6197,
          height: 2656
        },
        hotspots: [
          {
            id: "lintel_back_painting_detail",
            label: "门额背面花纹",
            shape: "rect",
            rect: [0.08, 0.24, 0.92, 0.74],
            title: "门额背面花纹",
            body: "门额背面是背面唯一保留彩画的位置，横幅构图，朝向墓室内部。两端墨画流云、双禽，中央绘牡丹。",
            record: "门额背面是背面唯一保留彩画的位置，横幅构图，朝向墓室内部。两端墨画流云、双禽，中央绘牡丹",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
            sourceClueId: "GATE-P0-02"
          },
          {
            id: "return_tomb_gate_from_lintel_back",
            label: "返回墓门",
            navLabel: "返回墓门",
            shape: "rect",
            rect: [0, 0.82, 1, 1],
            title: "返回墓门",
            body: "返回墓门主视图。",
            record: "返回墓门主视图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "tomb_gate_main",
              title: "返回墓门",
              body: "视角回到墓门正面。",
              closeLabel: "返回"
            }
          }
        ]
      },
      tomb_gate_brick_structure: {
        id: "tomb_gate_brick_structure",
        title: "墓门外层封门砖组织",
        image: {
          src: "assets/M1/02墓道与墓门/插图三 第一号墓墓门外层封门砖的组织.png",
          alt: "第一号墓墓门外层封门砖的组织",
          width: 4096,
          height: 4096
        },
        hotspots: [
          {
            id: "brick_structure_detail",
            label: "封门砖组织",
            shape: "rect",
            rect: [0.12, 0.12, 0.88, 0.82],
            title: "外层封门砖组织",
            body: "这张图更适合承载封门砖的组织方式，而不是让玩家只在墓门主图上猜砖缝。",
            record: "外层封门砖组织图可用于复核封门砖排列、灰缝和封堵方式。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
            sourceClueId: "GATE-P0-03"
          },
          {
            id: "return_tomb_gate_from_brick_structure",
            label: "返回墓门",
            navLabel: "返回墓门",
            shape: "rect",
            rect: [0, 0.82, 1, 1],
            title: "返回墓门",
            body: "返回墓门主视图。",
            record: "返回墓门主视图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "tomb_gate_main",
              title: "返回墓门",
              body: "视角回到墓门正面。",
              closeLabel: "返回"
            }
          }
        ]
      }
    }
  },
  corridor: {
    id: "corridor",
    title: "第一号墓甬道",
    startViewId: "corridor_overview",
    views: {
      corridor_overview: {
        id: "corridor_overview",
        title: "第一号墓甬道总览",
        image: {
          src: "assets/M1/17_补充总览图/P0-1_甬道总交互图.png",
          alt: "第一号墓甬道总交互图",
          width: 1672,
          height: 941
        },
        hotspots: [
          {
            id: "return_tomb_gate",
            label: "回望墓门",
            navLabel: "回望墓门",
            shape: "rect",
            rect: [0.02, 0.78, 0.26, 0.98],
            title: "回望墓门",
            body: "你已经进入甬道。回头看时，墓门已经打开，赭色门扇贴在门框一侧，身后入口重新变成可以被观察的空间关系。",
            record: "进入甬道后回望，可见已经打开的墓门与甬道入口关系。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "corridor_gate_back_view",
              title: "回望墓门",
              body: "你在甬道内回头，已打开的墓门进入视线。",
              closeLabel: "查看"
            }
          },
          {
            id: "corridor_roof",
            label: "甬道顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.18, 0.02, 0.82, 0.26],
            title: "甬道顶部",
            body: "甬道顶部系用横砖自东、西二壁叠涩内收作顶，并非平顶或券顶，除彩画部分外通刷赭色",
            record: "甬道顶部系用横砖自东、西二壁叠涩内收作顶，除彩画部分外通刷赭色。",
            sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
            sourceClueId: "L06",
            viewTransition: {
              targetViewId: "corridor_roof_view",
              title: "抬头看顶部",
              body: "甬道顶部进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "turn_corridor_east_wall",
            label: "转向东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.04, 0.24, 0.34, 0.78],
            title: "转向东壁",
            body: "甬道东壁进入视线。\n两侧壁画可以与顶部彩画一起复看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "corridor_east_wall",
              title: "转向东壁",
              body: "甬道东壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "turn_corridor_west_wall",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0.66, 0.24, 0.96, 0.78],
            title: "转向西壁",
            body: "甬道西壁进入视线。\n两侧壁画可以与顶部彩画一起复看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "corridor_west_wall",
              title: "转向西壁",
              body: "甬道西壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "corridor_mid",
            label: "顶部结构",
            shape: "rect",
            rect: [0.30, 0.62, 0.70, 0.88],
            title: "顶部结构",
            body: "甬道顶部两侧用横砖砌平，使外部轮廓整齐。\n在东、西二壁上用横砖叠涩内收，逐层收进形成顶面。",
            record: "甬道顶部两侧用横砖砌平，使外部轮廓整齐。\n在东、西二壁上用横砖叠涩内收，逐层收进形成顶面。",
            sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
            sourceClueId: "E04"
          },
          {
            id: "overlapping_pattern",
            label: "叠胜彩画",
            shape: "rect",
            rect: [0.34, 0.26, 0.66, 0.46],
            title: "叠胜彩画",
            body: "偏移处砖缝有一道刀刮痕，长约三寸。\n刀刮痕将原有菱形边界刮除后重绘。\n刮痕下方白灰层颜色较周围略黄，叠胜纹南端为六瓣花芯，北端变为四瓣。",
            record: "叠胜彩画偏移处有约三寸刀刮痕，原有菱形边界被刮除后重绘；刮痕下方白灰层略黄。",
            sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
            sourceClueId: "L06"
          },
          {
            id: "front_chamber_entry",
            label: "前室方向",
            navLabel: "进入前室",
            shape: "rect",
            rect: [0.40, 0.42, 0.62, 0.70],
            title: "前室方向",
            body: "甬道尽头的光线更平。\n前方墙面开始出现完整的人物与器物。",
            record: "甬道尽头可进入前室。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "front_chamber",
              targetViewId: "front_overview",
              title: "进入前室",
              body: "甬道顶部的错位已经记录。\n前方墙面开始出现完整的人物与器物。\n这里不再只是通道，而是一处被安排过的礼仪空间。",
              closeLabel: "进入",
              lockedBody: "甬道里的信息还没有整理完整。",
              missingRecords: [
                { id: "corridor:corridor_mid", label: "甬道中段" },
                { id: "corridor:corridor_roof", label: "甬道顶部" },
                { id: "corridor:overlapping_pattern", label: "叠胜彩画" }
              ]
            }
          }
        ]
      },
      corridor_roof_view: {
        id: "corridor_roof_view",
        title: "第一号墓甬道顶部",
        image: {
          src: "assets/M1/03甬道/第一号墓甬道顶(彭华士摄).png",
          alt: "第一号墓甬道顶部",
          width: 1817,
          height: 1226
        },
        hotspots: [
      {
        id: "corridor_mid",
        label: "甬道地面",
        shape: "rect",
        rect: [0.24, 0.66, 0.76, 0.88],
        title: "甬道地面",
        body: "甬道砖地的北部（即与前室入口相接处）低下二层砖，形成高度差，\n使甬道地面与前室砖床之间有一个明显的错台。",
        record: "甬道砖地的北部（即与前室入口相接处）低下二层砖，形成高度差，\n使甬道地面与前室砖床之间有一个明显的错台。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "E04"
      },
      {
        id: "corridor_roof",
        label: "甬道顶部",
        shape: "rect",
        rect: [0.16, 0.04, 0.84, 0.22],
        title: "甬道顶部",
        body: "甬道顶部，叠胜彩画以朱红为底，青绿绘出菱形单元。\n菱形单元在正中线上方本应交错对接。\n实测东侧第三个单元的尖角与西侧偏移约两寸。",
        record: "甬道顶部叠胜彩画以朱红为底、青绿绘菱形单元；东侧第三个单元与西侧偏移约两寸。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "L06"
      },
      {
        id: "overlapping_pattern",
        label: "叠胜彩画",
        shape: "rect",
        rect: [0.32, 0.36, 0.68, 0.64],
        title: "叠胜彩画",
        body: "甬道顶心绘有赭、黄二色叠胜。《营造法式》的“罗纹叠胜”与此类似。《营造法式》还记载，“柱头及脚并刷朱，用雌黄画方胜”，正与此相符。",
        record: "甬道顶心（即叠涩顶部正中）绘有赭、黄二色叠胜。“柱头及脚并刷朱，用雌黄画方胜”",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "L06",
        viewTransition: {
          targetViewId: "corridor_roof_pattern_closeup",
          title: "查看叠胜彩画近景",
          body: "叠胜彩画是一种一种菱形交叠的几何纹样",
          closeLabel: "查看"
        }
      },
      {
        id: "roof_arch_line",
        label: "甬道顶线",
        shape: "rect",
        rect: [0.18, 0.23, 0.82, 0.34],
        title: "甬道顶线",
        body: " 叠涩部分通刷赭色；顶心处绘有赭、黄二色的叠胜，其线条组合将甬道顶部图案进行分隔，如同顶心分界线。",
        record: "叠涩部分通刷赭色；顶心处绘有赭、黄二色的叠胜，其线条组合即为顶心分界线。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "L06"
      },
      {
        id: "return_tomb_gate",
        label: "回望墓门",
        navLabel: "回望墓门",
        shape: "rect",
        rect: [0.02, 0.82, 0.26, 0.98],
        title: "回望墓门",
        body: "你已经进入甬道。回头看时，墓门已经打开，赭色门扇贴在门框一侧，身后入口重新变成可以被观察的空间关系。",
        record: "进入甬道后回望，可见已经打开的墓门与甬道入口关系。",
        sourceFile: "game-navigation",
        sourceClueId: "NAV",
        viewTransition: {
          targetViewId: "corridor_gate_back_view",
          title: "回望墓门",
          body: "你在甬道内回头，已打开的墓门进入视线。",
          closeLabel: "查看"
        }
      },
      {
        id: "turn_corridor_east_wall",
        label: "转向东壁",
        navLabel: "转向东壁",
        shape: "rect",
        rect: [0.02, 0.08, 0.22, 0.24],
        title: "转向东壁",
        body: "甬道东壁进入视线。\n两侧壁画可以与顶部彩画一起复看。",
        sourceFile: "game-navigation",
        sourceClueId: "NAV",
        viewTransition: {
          targetViewId: "corridor_east_wall",
          title: "转向东壁",
          body: "甬道东壁进入视线。",
          closeLabel: "转向"
        }
      },
      {
        id: "turn_corridor_west_wall",
        label: "转向西壁",
        navLabel: "转向西壁",
        shape: "rect",
        rect: [0.78, 0.08, 0.98, 0.24],
        title: "转向西壁",
        body: "甬道西壁进入视线。\n两侧壁画可以与顶部彩画一起复看。",
        sourceFile: "game-navigation",
        sourceClueId: "NAV",
        viewTransition: {
          targetViewId: "corridor_west_wall",
          title: "转向西壁",
          body: "甬道西壁进入视线。",
          closeLabel: "转向"
        }
      },
      {
        id: "front_chamber_entry",
        label: "前室方向",
        navLabel: "进入前室",
        shape: "rect",
        rect: [0.36, 0.86, 0.64, 0.98],
        title: "前室方向",
        body: "甬道尽头的光线更平。\n前方墙面开始出现完整的人物与器物。",
        record: "甬道尽头可进入前室。",
        sourceFile: "game-navigation",
        sourceClueId: "NAV",
        transition: {
          targetSceneId: "front_chamber",
          targetViewId: "front_overview",
          title: "进入前室",
          body: "甬道顶部的错位已经记录。\n前方墙面开始出现完整的人物与器物。\n这里不再只是通道，而是一处被安排过的礼仪空间。",
          closeLabel: "进入",
          lockedBody: "甬道里的信息还没有整理完整。",
          missingRecords: [
            { id: "corridor:corridor_mid", label: "甬道中段" },
            { id: "corridor:corridor_roof", label: "甬道顶部" },
            { id: "corridor:overlapping_pattern", label: "叠胜彩画" }
          ]
        }
      }
        ]
      },
      corridor_roof_pattern_closeup: {
        id: "corridor_roof_pattern_closeup",
        title: "甬道顶叠胜彩画近景",
        image: {
          src: "assets/M1/03甬道/第一号墓甬道顶叠胜彩画.png",
          alt: "第一号墓甬道顶叠胜彩画",
          width: 1783,
          height: 1856
        },
        hotspots: [
          {
            id: "roof_pattern_detail",
            label: "叠胜纹样细部",
            shape: "rect",
            rect: [0.16, 0.14, 0.84, 0.78],
            title: "叠胜纹样细部",
            body: "“叠胜”是当时流行的锦绫纹饰名称，始见于唐代，宋代沿用。纹样为菱形交错的几何图案。",
            record: "“叠胜”是当时流行的锦绫纹饰名称，始见于唐代，宋代沿用。纹样为菱形交错的几何图案。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1甬道线索精修版_v1.0.md",
            sourceClueId: "COR-P0-01"
          },
          {
            id: "return_corridor_roof_from_pattern",
            label: "返回顶部",
            navLabel: "返回顶部",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回甬道顶部",
            body: "返回甬道顶部主视图。",
            record: "返回甬道顶部主视图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "corridor_roof_view",
              title: "返回顶部",
              body: "视角回到甬道顶部整体。",
              closeLabel: "返回"
            }
          }
        ]
      },
      corridor_east_wall: {
        id: "corridor_east_wall",
        title: "第一号墓甬道东壁",
        image: {
          src: "assets/M1/03甬道/第一号墓甬道东壁壁画（彭华士摄）.png",
          alt: "第一号墓甬道东壁壁画",
          width: 1410,
          height: 2490
        },
        hotspots: [
          {
            id: "east_wall_direction",
            label: "东壁人物",
            shape: "rect",
            rect: [0.06, 0.2, 0.44, 0.78],
            title: "东壁人物",
            body: "右侧一老者，露半身于砖砌门扇之右，头系蓝巾，着圆领窄袖浅蓝衫，面西，作启门状。\n其左二人：前者头系皂巾，着圆领窄袖四䙆浅蓝衫，衫下襟吊起系于腰间，露出窄腿浅蓝裤和草鞋，\n面北，双手持一束札上端涂有绛、蓝二色的筒囊，作自门外急趋室内状。\n后者头系白巾，左肩负钱贯，衣着动作同前者，亦面北。",
            record: "右侧一老者，露半身于砖砌门扇之右，作启门状。\n其左二人：前者头系皂巾，露出窄腿浅蓝裤和草鞋，\n面北，双手持一束札上端涂有绛、蓝二色的筒囊，作自门外急趋室内状。\n后者头系白巾，左肩负钱贯，衣着动作同前者，亦面北。",
            sourceFile: "M1/03甬道/03甬道-热点坐标映射-v1.2.md",
            sourceClueId: "HS-L10-01"
          },
          {
            id: "return_corridor_roof_from_east",
            label: "返回甬道总览",
            navLabel: "返回甬道总览",
            shape: "rect",
            rect: [0.02, 0.82, 0.32, 0.98],
            title: "返回甬道总览",
            body: "甬道总览重新进入视线。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "corridor_overview",
              title: "返回甬道总览",
              body: "甬道总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      corridor_west_wall: {
        id: "corridor_west_wall",
        title: "第一号墓甬道西壁",
        image: {
          src: "assets/M1/03甬道/第一号墓甬道西壁壁画(彭华士摄).png",
          alt: "第一号墓甬道西壁壁画",
          width: 1449,
          height: 2591
        },
        hotspots: [
          {
            id: "west_wall_inscription",
            label: "西壁人物图",
            shape: "rect",
            rect: [0.56, 0.2, 0.94, 0.78],
            title: "西壁人物图",
            body: "左侧一人头系蓝巾，着圆领窄袖短蓝衫、窄腿蓝裤，隐半身于砖砌门扇之内，面北。\n中间一马，黑鬃黑尾的浅黄色马，配有绛色马鞍、浅蓝色鞯，缰上系一浅色缨。 \n右侧二人： 前者头系皂巾，着圆领窄袖浅赭衫、窄腿白裤、草鞋，右手执一竿形物，面东。\n 后者头系蓝巾，巾上系一卷，卷面墨书“画上崔大郎酒”六字，双手捧一黑色酒瓶",
            record: "左侧一人头系蓝巾，着圆领窄袖短蓝衫、窄腿蓝裤，隐半身于砖砌门扇之内，面北。\n中间一马，黑鬃黑尾的浅黄色马，配有绛色马鞍、浅蓝色鞯，缰上系一浅色缨。 \n右侧二人： 前者头系皂巾，着圆领窄袖浅赭衫、窄腿白裤、草鞋，右手执一竿形物，面东。\n 后者头系蓝巾，巾上系一卷，卷面墨书“画上崔大郎酒”六字，双手捧一黑色酒瓶",
            sourceFile: "M1/03甬道/03甬道-热点坐标映射-v1.2.md",
            sourceClueId: "HS-L10-02"
          },
          {
            id: "return_corridor_roof_from_west",
            label: "返回甬道总览",
            navLabel: "返回甬道总览",
            shape: "rect",
            rect: [0.02, 0.82, 0.32, 0.98],
            title: "返回甬道总览",
            body: "甬道总览重新进入视线。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "corridor_overview",
              title: "返回甬道总览",
              body: "甬道总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      }
    }
  },
  passage: {
    id: "passage",
    title: "第一号墓过道",
    startViewId: "passage_overview",
    views: {
      passage_overview: {
        id: "passage_overview",
        title: "第一号墓过道轴线总览",
        image: {
          src: "assets/M1/17_补充总览图/P0-3_过道轴线总览图.png",
          alt: "第一号墓过道轴线总览图",
          width: 1672,
          height: 941
        },
        hotspots: [
          {
            id: "return_front_chamber",
            label: "返回前室",
            navLabel: "返回前室",
            shape: "rect",
            rect: [0.02, 0.78, 0.26, 0.98],
            title: "返回前室",
            body: "前室仍在身后。\n已经记录的信息会保留。",
            record: "返回前室。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "front_chamber",
              targetViewId: "front_overview",
              unlocked: true,
              title: "返回前室",
              body: "你退回前室入口总览。\n过道中的观察可以稍后继续。",
              closeLabel: "返回"
            }
          },
          {
            id: "passage_wall",
            label: "过道东壁",
            navLabel: "查看东壁",
            shape: "rect",
            rect: [0.08, 0.30, 0.42, 0.78],
            title: "过道东壁",
            body: "第一号墓过道东壁上方为画蓝色幔饰， 中部为壁面正中竖砖作破子棂窗。\n窗下右侧为黑色粮罐，左侧有斜倚束扎上端的白色粮袋.",
            record: "第一号墓过道东壁上方为画蓝色幔饰， 中部为壁面正中竖砖作破子棂窗。\n窗下右侧为黑色粮罐，左侧有斜倚束扎上端的白色粮袋.",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14",
            viewTransition: {
              targetViewId: "passage_main",
              title: "查看过道东壁",
              body: "过道东壁进入视线。",
              closeLabel: "查看"
            }
          },
          {
            id: "inscription",
            label: "纪年题记",
            shape: "rect",
            rect: [0.58, 0.56, 0.90, 0.84],
            title: "纪年题记",
            body: "左侧有斜倚束扎上端的白色粮袋，其中最前一袋袋面墨书。",
            record: "左侧有斜倚束扎上端的白色粮袋，其中最前一袋袋面墨书。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L01",
            closeupTransition: {
              targetViewId: "passage_inscription_closeup",
              title: "靠近观察纪年题记",
              body: "细看袋面墨书。",
              closeLabel: "靠近"
            }
          },
          {
            id: "lattice_window",
            label: "破子棂窗",
            shape: "rect",
            rect: [0.70, 0.30, 0.90, 0.58],
            title: "破子棂窗",
            body: "过道两壁绘有破子棂窗。\n窗格斜向分割，\n窗格与过道顶部构件同时出现在狭窄空间内。",
            record: "过道两壁绘有破子棂窗，窗格斜向分割，画面向两侧展开。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14",
            closeupTransition: {
              targetViewId: "passage_lattice_closeup",
              title: "靠近观察破子棂窗",
              body: "破子棂窗图像被放大。",
              closeLabel: "靠近"
            }
          },
          {
            id: "ceiling_canopy",
            label: "顶部宝盖",
            shape: "rect",
            rect: [0.18, 0.02, 0.82, 0.26],
            title: "顶部宝盖",
            body: "过道顶部为丁字盝顶式宝盖。",
            record: "过道顶部为丁字盝顶式宝盖",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14",
            closeupTransition: {
              targetViewId: "passage_canopy_closeup",
              title: "抬头看宝盖",
              body: "凑近细看宝盖顶。",
              closeLabel: "抬头"
            }
          },
          {
            id: "rear_chamber_placeholder",
            label: "后室入口",
            navLabel: "后室入口",
            shape: "rect",
            rect: [0.40, 0.38, 0.62, 0.72],
            title: "后室入口",
            body: "过道尽头通向后室。\n入口处光线更暗，壁面和顶部线条在前方收束。\n后室入口的位置已经确认。",
            record: "后室入口位置已经确认。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_rear_entry_closeup",
              title: "查看后室入口",
              body: "过道尽头的后室入口被单独打开。",
              closeLabel: "查看"
            }
          }
        ]
      },
      passage_rear_entry_closeup: {
        id: "passage_rear_entry_closeup",
        title: "过道北壁下部后室入口",
        image: {
          src: "assets/M1/09_过道/第一号墓过道北壁下部一一后室入口.png",
          alt: "第一号墓过道北壁下部一一后室入口",
          width: 1700,
          height: 2466
        },
        hotspots: [
          {
            id: "enter_rear_from_entry",
            label: "进入后室",
            navLabel: "进入后室",
            shape: "rect",
            rect: [0.26, 0.52, 0.74, 0.98],
            title: "进入后室",
            body: "题记在壁画下部留下深墨。\n破子棂窗向两侧展开，顶部宝盖向中心压低。\n过道尽头的入口已经可以进入。",
            record: "从过道北壁下部后室入口进入后室。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "rear_chamber",
              targetViewId: "rear_overview",
              completesSceneId: "passage",
              title: "进入后室",
              body: "过道入口之后，后室入口总览展开。\n后室北壁、南壁和侧壁可以继续查看。",
              closeLabel: "进入",
              lockedBody: "过道的信息还没有整理完整。",
              missingRecords: [
                { id: "passage:inscription", label: "纪年题记" },
                { id: "passage:lattice_window", label: "破子棂窗" },
                { id: "passage:ceiling_canopy", label: "顶部宝盖" }
              ]
            }
          },
          {
            id: "return_passage_from_rear_entry",
            label: "返回过道轴线",
            navLabel: "返回轴线",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道轴线",
            body: "返回过道轴线总览。",
            record: "返回过道轴线总览。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_overview",
              title: "返回过道轴线",
              body: "视角回到过道轴线总览。",
              closeLabel: "返回"
            }
          }
        ]
      },
      passage_main: {
        id: "passage_main",
        title: "第一号墓过道东壁",
        image: {
          src: "assets/M1/09_过道/第一号墓过道东壁.png",
          alt: "第一号墓过道东壁",
          width: 1504,
          height: 2258
        },
        hotspots: [
          {
            id: "passage_wall",
            label: "过道东壁",
            shape: "rect",
            rect: [0.1, 0.12, 0.9, 0.86],
            title: "过道东壁",
            body: "过道东壁沿狭窄通道展开。\n壁面图像与前室相接，画面向后室方向延伸。\n东壁上部与顶部构件相邻，空间比前室更收窄。",
            record: "过道东壁沿狭窄通道展开，壁面图像向后室方向延伸。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14"
          },
          {
            id: "inscription",
            label: "纪年题记",
            shape: "rect",
            rect: [0.12, 0.54, 0.9, 0.93],
            title: "纪年题记",
            body: "过道东壁下部可见纪年题记。\n墨色较深，题字位于壁画下方。\n题记与周围壁画色层之间有明显差别。",
            record: "过道东壁下部可见纪年题记，墨色较深，与周围壁画色层有差别。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L01",
            closeupTransition: {
              targetViewId: "passage_inscription_closeup",
              title: "靠近观察纪年题记",
              body: "过道东壁下部题记被放大。\n墨色、字径和题记下沿可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "lattice_window",
            label: "破子棂窗",
            shape: "rect",
            rect: [0.02, 0.12, 0.5, 0.62],
            title: "破子棂窗",
            body: "过道两壁绘有破子棂窗。\n窗格斜向分割，画面向两侧展开。\n窗格与过道顶部构件同时出现在狭窄空间内。",
            record: "过道两壁绘有破子棂窗，窗格斜向分割，画面向两侧展开。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14",
            closeupTransition: {
              targetViewId: "passage_lattice_closeup",
              title: "靠近观察破子棂窗",
              body: "破子棂窗图像被放大。\n斜向窗格和两壁关系可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "ceiling_canopy",
            label: "顶部宝盖",
            shape: "rect",
            rect: [0.08, 0, 0.92, 0.28],
            title: "顶部宝盖",
            body: "过道顶部为丁字盝顶式宝盖。\n宝盖沿过道中心收束，覆盖在通道上方。\n顶部边线与东壁铺作交接处较为紧促。",
            record: "过道顶部为丁字盝顶式宝盖，顶部边线与东壁铺作交接处较为紧促。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14",
            closeupTransition: {
              targetViewId: "passage_canopy_closeup",
              title: "抬头看宝盖",
              body: "顶部宝盖被单独显现。\n中心收束和边线交接处可以继续查看。",
              closeLabel: "抬头"
            }
          },
          {
            id: "return_passage_overview_from_east",
            label: "返回过道轴线",
            navLabel: "返回轴线",
            shape: "rect",
            rect: [0, 0.82, 0.78, 1],
            title: "返回过道轴线",
            body: "过道轴线总览重新进入视线。\n可以继续前往后室或返回前室。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_overview",
              title: "返回过道轴线",
              body: "过道轴线总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      passage_inscription_closeup: {
        id: "passage_inscription_closeup",
        title: "纪年题记近景",
        image: {
          src: "assets/M1/09_过道/第一号墓过道东壁下部壁画和纪年题记(彭华士摄).png",
          alt: "第一号墓过道东壁下部壁画和纪年题记",
          width: 2100,
          height: 1488
        },
        hotspots: [
          {
            id: "inscription_text",
            label: "题记文字",
            shape: "rect",
            rect: [0.18, 0.34, 0.82, 0.7],
            title: "题记文字",
            body: "墨书“元符二年赵大翁布” 八字。“元符二年”为北宋哲宗年号，即公元1099年。",
            record: "墨书“元符二年赵大翁布” 八字。“元符二年”为北宋哲宗年号，即公元1099年。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L01"
          },
          {
            id: "inscription_lower_edge",
            label: "题记下沿",
            shape: "rect",
            rect: [0.2, 0.66, 0.82, 0.88],
            title: "题记下沿",
            body: "题记下沿距地面约三尺四寸。\n笔画起止处可见墨汁溢出砖缝。",
            record: "题记下沿距地面约三尺四寸，笔画起止处可见墨汁溢出砖缝。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L01"
          },
          {
            id: "return_passage_from_inscription",
            label: "返回过道东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道东壁",
            body: "题记位置重新回到整幅壁面之中。",
            record: "返回过道东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道东壁",
              body: "过道东壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      passage_lattice_closeup: {
        id: "passage_lattice_closeup",
        title: "破子棂窗近景",
        image: {
          src: "assets/M1/09_过道/插图九 第一号墓过道两壁的破子棂窗.png",
          alt: "第一号墓过道两壁的破子棂窗",
          width: 1906,
          height: 1257
        },
        hotspots: [
          {
            id: "lattice_lines",
            label: "“破子棂窗”细节",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "“破子棂窗”细节",
            body: "“破子棂窗” 是墓室砖雕仿木结构中的一种窗式。\n由上额、𣏢柱、窗额、立颊、腰串等构件围合，\n内影作子桯，子桯之内竖砖作破子棂，\n即截面为三角形的立棂，一面向外呈尖棱状。",
            record: "“破子棂窗” 是墓室砖雕仿木结构中的一种窗式。\n由上额、𣏢柱、窗额、立颊、腰串等构件围合，\n内影作子桯，子桯之内竖砖作破子棂，\n即截面为三角形的立棂，一面向外呈尖棱状。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14"
          },
          {
            id: "return_passage_from_lattice",
            label: "返回过道东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道东壁",
            body: "破子棂窗重新回到过道两侧关系中。",
            record: "返回过道东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道东壁",
              body: "过道东壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      passage_canopy_closeup: {
        id: "passage_canopy_closeup",
        title: "顶部宝盖近景",
        image: {
          src: "assets/M1/09_过道/第一号墓前室、过道顶一一丁字盗顶式宝盖(原色版，彭华士摄).png",
          alt: "第一号墓前室、过道顶丁字盝顶式宝盖",
          width: 2196,
          height: 1909
        },
        hotspots: [
          {
            id: "canopy_center",
            label: "宝盖中心",
            shape: "rect",
            rect: [0.18, 0.12, 0.82, 0.66],
            title: "丁字盝顶式宝盖",
            body: "过道顶为扁方形宝盖式盝顶藻，因过道顶南面与前室顶北坡中部相连，\n省去了盝顶的南斜面，二顶联合遂成一 “丁字盝顶” 。\n山花帐头之上内收三层，构成宝盖的叠涩收进结构。",
            record: "过道顶为扁方形宝盖式盝顶藻，因过道顶南面与前室顶北坡中部相连，\n省去了盝顶的南斜面，二顶联合遂成一 “丁字盝顶” 。\n山花帐头之上内收三层，构成宝盖的叠涩收进结构。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14"
          },
          {
            id: "return_passage_from_canopy",
            label: "返回过道东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道东壁",
            body: "顶部宝盖重新回到过道东壁上方。",
            record: "返回过道东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道东壁",
              body: "过道东壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      }
    }
  },
  rear_chamber: {
    id: "rear_chamber",
    title: "第一号墓后室",
    startViewId: "rear_overview",
    completionHint: {
      sourceHotspotId: "rear_summary",
      text: "后室的核心证据与日常器物线已经记录。\n可以回到后室入口总览中汇总。"
    },
    views: {
      rear_overview: {
        id: "rear_overview",
        title: "第一号墓后室入口总览",
        image: {
          src: "assets/M1/17_补充总览图/P0-4_后室入口总览图.png",
          alt: "第一号墓后室入口总览图",
          width: 1672,
          height: 941
        },
        hotspots: [
          {
            id: "rear_overview_return_passage",
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0.02, 0.78, 0.24, 0.98],
            title: "返回过道",
            body: "过道仍在身后。\n后室入口总览会保留在当前位置。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              targetViewId: "passage_overview",
              unlocked: true,
              title: "返回过道",
              body: "你退回过道轴线总览。\n后室入口仍可再次进入。",
              closeLabel: "返回"
            }
          },
          {
            id: "rear_overview_enter_north",
            label: "进入后室北壁",
            navLabel: "进入后室北壁",
            shape: "rect",
            rect: [0.34, 0.34, 0.66, 0.76],
            title: "进入后室北壁",
            body: "门框之后光线转暗。\n后室北壁与砖床区域进入视线。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_north",
              title: "进入后室北壁",
              body: "后室北壁进入视线。",
              closeLabel: "进入"
            }
          },
          {
            id: "rear_overview_turn_south",
            label: "转向南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.32, 0.76, 0.68, 0.98],
            title: "转向南壁",
            body: "后室南壁位于入口背面。\n门道边界与壁画陈设重新进入视线。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_south",
              title: "转向南壁",
              body: "后室南壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "rear_overview_turn_southwest",
            label: "转向西南壁",
            navLabel: "转向西南壁",
            shape: "rect",
            rect: [0.04, 0.48, 0.30, 0.82],
            title: "转向西南壁",
            body: "后室西南壁进入视线。\n镜台、曲足盆架与杌集中在这一侧。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_southwest",
              title: "转向西南壁",
              body: "后室西南壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "rear_overview_turn_northeast",
            label: "转向东北壁",
            navLabel: "转向东北壁",
            shape: "rect",
            rect: [0.70, 0.28, 0.96, 0.70],
            title: "转向东北壁",
            body: "后室东北壁进入视线。\n壁面上部的小铺作与灯菜图像可继续查看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northeast",
              title: "转向东北壁",
              body: "后室东北壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "rear_overview_turn_northwest",
            label: "转向西北壁",
            navLabel: "转向西北壁",
            shape: "rect",
            rect: [0.04, 0.22, 0.30, 0.48],
            title: "转向西北壁",
            body: "后室西北壁进入视线。\n青绿颜料层、剪刀与熨斗图像可继续查看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northwest",
              title: "转向西北壁",
              body: "后室西北壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "rear_overview_look_ceiling",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.20, 0.04, 0.80, 0.24],
            title: "抬头看顶部",
            body: "后室顶部进入视线。\n室顶小铺作与壁面上缘补间铺作可以继续查看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_ceiling",
              title: "抬头看顶部",
              body: "后室顶部进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "rear_summary",
            label: "后室完成确认",
            navLabel: "汇总后室",
            shape: "rect",
            rect: [0.76, 0.80, 0.98, 0.98],
            title: "后室完成确认",
            body: "后室北壁假门、地券、砖床遗存和出土物分布已经完成对照。\n南壁高几、西南壁镜台与曲足盆架、西北壁剪刀熨斗和颜料层位共同构成日常器物线。\n顶部铺作补足了后室空间结构。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              completeOnly: true,
              completesSceneId: "rear_chamber",
              title: "后室完成确认",
              body: "后室北壁假门、地券、砖床遗存和出土物分布已经完成对照。\n南壁高几、西南壁镜台与曲足盆架、西北壁剪刀熨斗和颜料层位共同构成日常器物线。\n顶部铺作补足了后室空间结构。\n后室证据已经收束，终章汇总可以开启。你仍可返回各墙面和近景复看细节。",
              closeLabel: "记下",
              lockedBody: "后室观察尚未收束。请补齐北壁、地券、葬具证据链和后室汇总所需记录。",
              missingRecords: [
                { id: "analysis:rear_chamber:review_false_door_structure", label: "北壁：假门、妇人启门与门缝" },
                { id: "analysis:rear_chamber:review_document_layer", label: "地券近景：朱书、行列与位置" },
                { id: "analysis:rear_chamber:review_burial_distribution", label: "葬具证据链：砖床、人骨、铁钉与地券" },
                { excludedId: "rear_chamber:woman_hand", label: "妇人启门近景：在记录夹中降级手部断口" },
                { excludedId: "rear_chamber:nail_count", label: "人骨近景：在记录夹中降级铁钉数量差异" },
                { id: "analysis:rear_chamber:combo", label: "记录夹：完成后室汇总" }
              ]
            }
          },
          {
            id: "final_report_placeholder",
            label: "查看终章汇总",
            navLabel: "查看终章汇总",
            navLabelCompletedSceneIds: ["tomb_gate", "corridor", "front_chamber", "passage", "rear_chamber"],
            shape: "rect",
            rect: [0.76, 0.60, 0.98, 0.78],
            title: "终章汇总",
            body: "五个章节的阶段判断已经可以并读。\n墓门提供入口结构证据，甬道和过道连接空间与时间，前室展开礼仪秩序，后室收束图像、文书、遗存和日常器物。\n阶段性研究判断已经形成：M1 的意义不来自单一异常，而来自空间、图像、文字和遗物之间的多层对应。\n终章结论卡已经在线索墙中生成，可回到记录与结论界面复看主线证据。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              completeOnly: true,
              title: "终章汇总",
              body: "五个章节的阶段判断已经可以并读。\n墓门提供入口结构证据，甬道和过道连接空间与时间，前室展开礼仪秩序，后室收束图像、文书、遗存和日常器物。\n阶段性研究判断已经形成：M1 的意义不来自单一异常，而来自空间、图像、文字和遗物之间的多层对应。\n终章结论卡已经在线索墙中生成，可回到记录与结论界面复看主线证据。",
              closeLabel: "知道了",
              lockedBody: "终章汇总尚未开放。请先完成五个章节的组合判断；后室还需要完成葬具证据链、降级记录和汇总。",
              missingRecords: [
                { sceneId: "tomb_gate", completed: true, label: "墓门：完成章节判断" },
                { sceneId: "corridor", completed: true, label: "甬道：完成章节判断" },
                { sceneId: "front_chamber", completed: true, label: "前室：完成章节判断" },
                { sceneId: "passage", completed: true, label: "过道：完成章节判断" },
                { id: "analysis:rear_chamber:combo", label: "后室：在记录夹中形成后室组合判断" },
                { sceneId: "rear_chamber", completed: true, label: "后室：完成汇总后室" }
              ]
            }
          }
        ]
      },
      rear_south: {
        id: "rear_south",
        title: "第一号墓后室南壁",
        image: {
          src: "assets/M1/11_后室_南壁/第一号墓后室南壁一一后室入口背面.png",
          alt: "第一号墓后室南壁入口背面",
          width: 2151,
          height: 1418
        },
        hotspots: [
          {
            id: "rear_south_back_entrance",
            label: "入口背面",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "后室南壁入口背面",
            body: "后室南壁的入口背面是过道北壁原砌的过梁门.",
            record: "后室南壁的入口背面是过道北壁原砌的过梁门.",
            sourceFile: "M1/11_后室_南壁/11_后室_南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L22-HS-L22-01"
          },
          {
            id: "rear_south_high_table",
            label: "高几",
            shape: "rect",
            rect: [0.18, 0.58, 0.82, 0.9],
            title: "后室南壁高几",
            body: "后室南壁壁画中可见高几。\n几面较窄，足部向下承接，整体呈静置陈设状态。\n它位于后室入口背面一侧，与通行边界相邻。",
            record: "后室南壁见高几图像，位置靠近入口背面，呈静置陈设状态。",
            sourceFile: "M1/11_后室_南壁/11_后室_南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L22-HS-L22-02",
            closeupTransition: {
              targetViewId: "rear_south_high_table_closeup",
              title: "靠近观察高几",
              body: "高几图像被放大。\n几面、支足和壁画边缘可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "return_rear_overview_from_south",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            shape: "rect",
            rect: [0, 0.82, 0.24, 1],
            title: "返回入口总览",
            body: "后室入口总览仍在身后。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回入口总览",
              body: "后室入口总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_south_high_table_closeup: {
        id: "rear_south_high_table_closeup",
        title: "后室南壁高几近景",
        image: {
          src: "assets/M1/11_后室_南壁/第一号墓后室南壁壁画中的高几.png",
          alt: "第一号墓后室南壁壁画中的高几",
          width: 886,
          height: 1412
        },
        hotspots: [
          {
            id: "rear_south_high_table_detail",
            label: "高几细部",
            shape: "rect",
            rect: [0.18, 0.58, 0.82, 0.9],
            title: "高几细部",
            body: "高几几面较窄，足部向下承接。\n器物以线条勾出轮廓，整体呈静置陈设状态。",
            record: "高几几面较窄，足部向下承接，器物轮廓清楚。",
            sourceFile: "M1/11_后室_南壁/11_后室_南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L22-HS-L22-02"
          },
          {
            id: "return_rear_south_from_high_table",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回南壁",
            body: "高几重新回到后室南壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_south",
              title: "返回南壁",
              body: "后室南壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_southwest: {
        id: "rear_southwest",
        title: "后室西南壁陈设组合图",
        image: {
          src: "assets/M1/13_后室_西壁与西南壁/后室西南壁陈设组合图.png",
          alt: "后室西南壁陈设组合图",
          width: 1920,
          height: 1080
        },
        hotspots: [
          {
            id: "rear_southwest_mirror_stand",
            label: "镜台",
            shape: "rect",
            rect: [0.05, 0.18, 0.29, 0.88],
            title: "后室西南壁镜台",
            body: "镜台位于后室西南壁壁画正中偏左侧，\n砖砌悬幔下方。",
            record: "镜台位于后室西南壁壁画正中偏左侧，\n砖砌悬幔下方。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-03",
            closeupTransition: {
              targetViewId: "rear_southwest_mirror_closeup",
              title: "靠近观察镜台",
              body: "凑近观看镜台的台面",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_southwest_basin_stand",
            label: "曲足盆架",
            shape: "rect",
            rect: [0.34, 0.24, 0.59, 0.88],
            title: "曲足盆架",
            body: "组合图中部为曲足盆架。\n它与镜台、杌共同构成西南壁陈设关系，适合从组合图再进入近景复查。",
            record: "组合图中部为曲足盆架，与镜台、杌共同构成西南壁陈设关系。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-02",
            closeupTransition: {
              targetViewId: "rear_southwest_basin_stand_closeup",
              title: "靠近观察曲足盆架",
              body: "曲足盆架是上方置有盥盆，是后室“内寝”中盥洗空间的标配家具",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_southwest_stool",
            label: "杌",
            shape: "rect",
            rect: [0.63, 0.22, 0.89, 0.88],
            title: "杌",
            body: "组合图右侧为杌。\n杌的尺度低于镜台和曲足盆架。",
            record: "组合图右侧为杌，杌的尺度低于镜台和曲足盆架。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-01",
            closeupTransition: {
              targetViewId: "rear_southwest_stool_closeup",
              title: "靠近观察杌",
              body: "杌的图像被放大。\n器身和足部轮廓可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "return_rear_overview_from_southwest",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回入口总览",
            body: "后室入口总览仍在身后。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回入口总览",
              body: "后室入口总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_southwest_mirror_closeup: {
        id: "rear_southwest_mirror_closeup",
        title: "后室西南壁镜台近景",
        image: {
          src: "assets/M1/13_后室_西壁与西南壁/第一号墓后室西南壁壁画中的镜台.png",
          alt: "第一号墓后室西南壁壁画中的镜台",
          width: 665,
          height: 1074
        },
        hotspots: [
          {
            id: "rear_southwest_mirror_detail",
            label: "镜台细部",
            shape: "rect",
            rect: [0.12, 0.16, 0.88, 0.76],
            title: "镜台细部",
            body: "立柱式高镜台，镜台顶端画有七枚蕉叶形装饰，\n最上一枚蕉叶饰下方系有一面圆镜。",
            record: "立柱式高镜台，镜台顶端画有七枚蕉叶形装饰，\n最上一枚蕉叶饰下方系有一面圆镜。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-03"
          },
          {
            id: "return_rear_southwest_from_mirror",
            label: "返回西南壁",
            navLabel: "返回西南壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西南壁",
            body: "镜台重新回到后室西南壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_southwest",
              title: "返回西南壁",
              body: "后室西南壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_southwest_basin_stand_closeup: {
        id: "rear_southwest_basin_stand_closeup",
        title: "后室西南壁曲足盆架近景",
        image: {
          src: "assets/M1/13_后室_西壁与西南壁/插图三六 第一号墓后室西南壁壁画中的曲足盆架.png",
          alt: "第一号墓后室西南壁壁画中的曲足盆架",
          width: 1527,
          height: 1715
        },
        hotspots: [
          {
            id: "rear_southwest_basin_stand_detail",
            label: "曲足盆架细部",
            shape: "rect",
            rect: [0.16, 0.18, 0.84, 0.88],
            title: "曲足盆架细部",
            body: "一绛色曲足盆架，架上置蓝色白缘盥盆，\n盥盆为蓝色白缘。",
            record: "一绛色曲足盆架，架上置蓝色白缘盥盆，\n盥盆为蓝色白缘。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-02"
          },
          {
            id: "return_rear_southwest_from_basin_stand",
            label: "返回西南壁",
            navLabel: "返回西南壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西南壁",
            body: "曲足盆架重新回到后室西南壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_southwest",
              title: "返回西南壁",
              body: "后室西南壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_southwest_stool_closeup: {
        id: "rear_southwest_stool_closeup",
        title: "后室西南壁杌近景",
        image: {
          src: "assets/M1/13_后室_西壁与西南壁/插图三五 第一号墓后室西南壁壁画中的杌.png",
          alt: "第一号墓后室西南壁壁画中的杌",
          width: 1600,
          height: 2149
        },
        hotspots: [
          {
            id: "rear_southwest_stool_detail",
            label: "杌细部",
            shape: "rect",
            rect: [0.16, 0.18, 0.84, 0.88],
            title: "杌细部",
            body: "杌为深蓝色方形坐具，\n四足直立，无靠背、无扶手。\n杌上“似置物”但模糊不清\n——可能原绘有妆奁、织物或文书，\n但因颜料剥落而不可辨识。",
            record: "杌为深蓝色方形坐具，\n四足直立，无靠背、无扶手。\n杌上“似置物”但模糊不清\n——可能原绘有妆奁、织物或文书，\n但因颜料剥落而不可辨识。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-01"
          },
          {
            id: "return_rear_southwest_from_stool",
            label: "返回西南壁",
            navLabel: "返回西南壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西南壁",
            body: "杌重新回到后室西南壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_southwest",
              title: "返回西南壁",
              body: "后室西南壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northeast: {
        id: "rear_northeast",
        title: "第一号墓后室东北壁",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室东北壁.png",
          alt: "第一号墓后室东北壁",
          width: 2246,
          height: 1543
        },
        hotspots: [
          {
            id: "rear_northeast_bracket",
            label: "小铺作",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.32],
            title: "后室东北隅小铺作",
            body: "后室东北隅小铺作属于室顶小铺作体系，\n位于后室六壁上层的随瓣方之上，\n是后室室顶的支承构件之一。",
            record: "后室东北隅小铺作属于室顶小铺作体系，\n位于后室六壁上层的随瓣方之上，\n是后室室顶的支承构件之一。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L16-HS-L16-03",
            closeupTransition: {
              targetViewId: "rear_northeast_bracket_closeup",
              title: "靠近观察东北隅小铺作",
              body: "东北隅小铺作可凑近观看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_northeast_lamp",
            label: "灯菜",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "后室东北壁灯菜",
            body: "菜，唐代称“灯树”，宋代亦俗称“灯架”“灯菜”，\n为后室照明设施。\n灯菜图位于后室东北壁破子棂窗上部。\n立柱式高灯菜，顶部设承盘，柱身有节状装饰。\n灯菜上方悬有绛色悬幔。",
            record: "菜，唐代称“灯树”，宋代亦俗称“灯架”“灯菜”，\n为后室照明设施。\n灯菜图位于后室东北壁破子棂窗上部。\n立柱式高灯菜，顶部设承盘，柱身有节状装饰。\n灯菜上方悬有绛色悬幔。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "H04-HS-H04-02",
            closeupTransition: {
              targetViewId: "rear_northeast_lamp_closeup",
              title: "靠近观察灯菜",
              body: "走进观察灯菜。",
              closeLabel: "靠近"
            }
          },
          {
            id: "turn_rear_northwest_from_northeast",
            label: "转向西北壁",
            navLabel: "转向西北壁",
            shape: "rect",
            rect: [0, 0.36, 0.22, 0.82],
            title: "转向西北壁",
            body: "视线转向后室西北壁。\n剪刀、熨斗与青绿颜料层进入观察范围。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northwest",
              title: "转向西北壁",
              body: "后室西北壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_rear_overview_from_northeast",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            shape: "rect",
            rect: [0, 0.82, 0.28, 1],
            title: "返回入口总览",
            body: "后室入口总览仍在身后。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回入口总览",
              body: "后室入口总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northeast_lamp_closeup: {
        id: "rear_northeast_lamp_closeup",
        title: "后室东北壁灯菜近景",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室东北壁壁画中的灯菜.png",
          alt: "第一号墓后室东北壁壁画中的灯菜",
          width: 518,
          height: 1552
        },
        hotspots: [
          {
            id: "rear_northeast_lamp_detail",
            label: "灯菜细部",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "灯菜细部",
            body: "灯菜器形细长，轮廓沿壁面向下展开。\n器物位置靠近壁面一侧。",
            record: "灯菜器形细长，轮廓沿壁面向下展开。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "H04-HS-H04-02"
          },
          {
            id: "return_rear_northeast_from_lamp",
            label: "返回东北壁",
            navLabel: "返回东北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回东北壁",
            body: "灯菜重新回到后室东北壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northeast",
              title: "返回东北壁",
              body: "后室东北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northeast_bracket_closeup: {
        id: "rear_northeast_bracket_closeup",
        title: "后室东北隅小铺作近景",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室东南、东北隅铺作上面的小铺作.png",
          alt: "第一号墓后室东南、东北隅铺作上面的小铺作",
          width: 2077,
          height: 1528
        },
        hotspots: [
          {
            id: "rear_northeast_bracket_detail",
            label: "小铺作细部",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.32],
            title: "小铺作细部",
            body: "小铺作位于上部过渡带。\n构件排列紧密，层级轮廓清楚。",
            record: "东北隅小铺作位于上部过渡带，构件排列紧密。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L16-HS-L16-03"
          },
          {
            id: "return_rear_northeast_from_bracket",
            label: "返回东北壁",
            navLabel: "返回东北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回东北壁",
            body: "小铺作重新回到后室东北壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northeast",
              title: "返回东北壁",
              body: "后室东北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northwest: {
        id: "rear_northwest",
        title: "第一号墓后室西北壁",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁.png",
          alt: "第一号墓后室西北壁",
          width: 2120,
          height: 1571
        },
        hotspots: [
          {
            id: "rear_northwest_pigment_layer",
            label: "颜料层位",
            shape: "rect",
            rect: [0.56, 0.2, 0.94, 0.78],
            title: "后室西北壁",
            body: "西北壁壁画上层为室顶小斗栱彩画，为施青晕之花卉，\n保存不完整，颜料层有剥落与漫漶。\n下层壁画有剪刀、熨斗、藤制小矮几、狸奴等，\n为淡黄、赭色。",
            record: "西北壁壁画上层为室顶小斗栱彩画，为施青晕之花卉，\n保存不完整，颜料层有剥落与漫漶。\n下层壁画有剪刀、熨斗、藤制小矮几、狸奴等，\n为淡黄、赭色。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L08-HS-L08-04",
            closeupTransition: {
              targetViewId: "rear_northwest_pigment_closeup",
              title: "想凑近观察壁画",
              body: "凑近观看可以看到更多细节。",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_northwest_scissors_iron",
            label: "剪刀与熨斗",
            shape: "rect",
            rect: [0.5, 0.34, 0.94, 0.9],
            title: "细腰剪刀与熨斗",
            body: "后室西北壁壁画中可见细腰剪刀与熨斗。\n剪刀刃口处青绿颜料有剥落，局部露出较早的墨线轮廓。\n器物线条与下层痕迹并不完全重合。",
            record: "后室西北壁见细腰剪刀与熨斗；剪刀刃口处青绿颜料剥落，露出较早墨线。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L08-HS-L08-07",
            closeupTransition: {
              targetViewId: "rear_northwest_scissors_iron_closeup",
              title: "这里好像有图案......?",
              body: ".......好像是剪刀与熨斗？",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_northwest_upper_bracket",
            label: "上层小斗栱",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.32],
            title: "后室西北壁上层小斗栱",
            body: "后室西北壁上方可见小斗栱彩画。\n构件位于壁画上缘，和下部器物图像形成上下分区。\n西北壁下部图像较复杂，留出的壁画带更宽。",
            record: "后室西北壁上方见小斗栱彩画，下部器物图像较复杂。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L16-HS-L16-05",
            closeupTransition: {
              targetViewId: "rear_northwest_bracket_closeup",
              title: "靠近观察西北壁小斗栱",
              body: "西北壁上层小斗拱，在六壁上层的随瓣方之上，\n砌转角铺作，两转角间砌一朵补间铺作。",
              closeLabel: "靠近"
            }
          },
          {
            id: "turn_rear_northeast_from_northwest",
            label: "转向东北壁",
            navLabel: "转向东北壁",
            shape: "rect",
            rect: [0.78, 0.36, 1, 0.82],
            title: "转向东北壁",
            body: "视线转向后室东北壁。\n灯菜与东北隅小铺作重新进入观察范围。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northeast",
              title: "转向东北壁",
              body: "后室东北壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_rear_overview_from_northwest",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            shape: "rect",
            rect: [0, 0.82, 0.28, 1],
            title: "返回入口总览",
            body: "后室入口总览仍在身后。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回入口总览",
              body: "后室入口总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northwest_scissors_iron_closeup: {
        id: "rear_northwest_scissors_iron_closeup",
        title: "后室西北壁剪刀熨斗近景",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁壁画中的细腰剪刀、熨斗.png",
          alt: "第一号墓后室西北壁壁画中的细腰剪刀、熨斗",
          width: 1390,
          height: 2536
        },
        hotspots: [
          {
            id: "rear_northwest_scissors_iron_detail",
            label: "剪刀熨斗细部",
            shape: "rect",
            rect: [0.12, 0.14, 0.88, 0.86],
            title: "剪刀熨斗细部",
            body: "窗右边绘有一处蕉叶形钉，蕉叶钉是宋式常见家具。\n蕉叶钉下悬挂一把细腰、修刃的剪刀，\n剪刀左侧竖置一只熨斗。",
            record: "窗右边绘有一处蕉叶形钉，蕉叶钉是宋式常见家具。\n蕉叶钉下悬挂一把细腰、修刃的剪刀，\n剪刀左侧竖置一只熨斗",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L08-HS-L08-07"
          },
          {
            id: "return_rear_northwest_from_scissors_iron",
            label: "返回西北壁",
            navLabel: "返回西北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西北壁",
            body: "剪刀与熨斗重新回到后室西北壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northwest",
              title: "返回西北壁",
              body: "后室西北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northwest_pigment_closeup: {
        id: "rear_northwest_pigment_closeup",
        title: "后室西北壁颜料层位近景",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁.png",
          alt: "第一号墓后室西北壁",
          width: 2120,
          height: 1571
        },
        hotspots: [
          {
            id: "rear_northwest_pigment_detail",
            label: "颜料层位细部",
            shape: "rect",
            rect: [0.56, 0.2, 0.94, 0.78],
            title: "颜料层位细部",
            body: "青绿颜料层表面有细密龟裂。\n边缘可见朱红色线迹，白灰层中夹杂朱红颗粒。",
            record: "青绿颜料层表面见细密龟裂，边缘见朱红色线迹。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L08-HS-L08-04"
          },
          {
            id: "return_rear_northwest_from_pigment",
            label: "返回西北壁",
            navLabel: "返回西北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西北壁",
            body: "颜料层位重新回到后室西北壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northwest",
              title: "返回西北壁",
              body: "后室西北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_northwest_bracket_closeup: {
        id: "rear_northwest_bracket_closeup",
        title: "后室西北壁小斗栱近景",
        image: {
          src: "assets/M1/14_后室_东北壁与西北壁/第一号墓后室西北壁上层小斗栱彩画.png",
          alt: "第一号墓后室西北壁上层小斗栱彩画",
          width: 916,
          height: 656
        },
        hotspots: [
          {
            id: "rear_northwest_bracket_detail",
            label: "小斗栱细部",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.58],
            title: "小斗栱细部",
            body: "小斗拱彩画仅用青、绿两色。\n“斗”面刷青色，外棱施白缘道，栱心正中画白线一道；\n“栱”面刷白色，正中画青线一道，栱外棱施青缘道；\n栱眼壁仅西北壁左侧者尚存痕迹，为施青晕之花卉，\n慢栱与柱头枋之间的小栱眼为墨画云朵。",
            record: "小斗拱彩画仅用青、绿两色。\n“斗”面刷青色，外棱施白缘道，栱心正中画白线一道；\n“栱”面刷白色，正中画青线一道，栱外棱施青缘道；\n栱眼壁仅西北壁左侧者尚存痕迹，为施青晕之花卉，\n慢栱与柱头枋之间的小栱眼为墨画云朵。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L16-HS-L16-05"
          },
          {
            id: "return_rear_northwest_from_bracket",
            label: "返回西北壁",
            navLabel: "返回西北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西北壁",
            body: "小斗栱重新回到后室西北壁整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_northwest",
              title: "返回西北壁",
              body: "后室西北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_ceiling: {
        id: "rear_ceiling",
        title: "第一号墓后室顶部",
        image: {
          src: "assets/M1/15_后室_顶部隅角及其他/第一号墓后室顶.png",
          alt: "第一号墓后室顶",
          width: 2524,
          height: 1660
        },
        hotspots: [
          {
            id: "rear_ceiling_overview",
            label: "后室顶",
            shape: "rect",
            rect: [0.08, 0.08, 0.92, 0.72],
            title: "后室顶",
            body: "后室顶部位于壁面上方。\n顶部图像显示室顶小铺作排列在上部过渡带。\n下方壁面上缘另有补间铺作。",
            record: "后室顶部见室顶小铺作，下方壁面上缘另有补间铺作。",
            sourceFile: "M1/15_后室_顶部隅角及其他/15_后室_顶部隅角及其他-热点坐标映射-v1.2.md",
            sourceClueId: "L17-HS-L17-03"
          },
          {
            id: "rear_ceiling_intermediate_bracket",
            label: "补间铺作",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.32],
            title: "后室补间铺作",
            body: "后室补间铺作位于壁面上缘。\n构件出跳较深，层级清楚。\n它与室顶小铺作的密度和比例不同。",
            record: "后室壁面上缘见补间铺作，出跳较深，与室顶小铺作比例不同。",
            sourceFile: "M1/15_后室_顶部隅角及其他/15_后室_顶部隅角及其他-热点坐标映射-v1.2.md",
            sourceClueId: "L17-HS-L17-01",
            closeupTransition: {
              targetViewId: "rear_ceiling_intermediate_bracket_closeup",
              title: "靠近观察补间铺作",
              body: "补间铺作图像被放大。\n出跳深度和构件层级可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_ceiling_small_bracket",
            label: "室顶小铺作",
            shape: "rect",
            rect: [0.2, 0.34, 0.8, 0.72],
            title: "后室室顶小铺作",
            body: "后室室顶可见小铺作。\n小铺作排列在顶部过渡带，分布较密。\n它与下方补间铺作形成不同层级。",
            record: "后室室顶见小铺作，排列较密，与下方补间铺作形成层级差。",
            sourceFile: "M1/15_后室_顶部隅角及其他/15_后室_顶部隅角及其他-热点坐标映射-v1.2.md",
            sourceClueId: "L17-HS-L17-02",
            closeupTransition: {
              targetViewId: "rear_ceiling_small_bracket_closeup",
              title: "靠近观察室顶小铺作",
              body: "室顶小铺作图像被放大。\n构件排列和顶部过渡带可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "return_rear_overview_from_ceiling",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            shape: "rect",
            rect: [0, 0.82, 0.28, 1],
            title: "返回入口总览",
            body: "后室入口总览仍在身后。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回入口总览",
              body: "后室入口总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_ceiling_intermediate_bracket_closeup: {
        id: "rear_ceiling_intermediate_bracket_closeup",
        title: "后室补间铺作近景",
        image: {
          src: "assets/M1/15_后室_顶部隅角及其他/插图一二 第一号墓后室补间铺作.png",
          alt: "第一号墓后室补间铺作",
          width: 2304,
          height: 1728
        },
        hotspots: [
          {
            id: "rear_ceiling_intermediate_bracket_detail",
            label: "补间铺作细部",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.62],
            title: "补间铺作细部",
            body: "补间铺作位于壁面上缘。\n构件出跳较深，层级轮廓清楚。",
            record: "补间铺作位于壁面上缘，构件出跳较深，层级轮廓清楚。",
            sourceFile: "M1/15_后室_顶部隅角及其他/15_后室_顶部隅角及其他-热点坐标映射-v1.2.md",
            sourceClueId: "L17-HS-L17-01"
          },
          {
            id: "return_rear_ceiling_from_intermediate_bracket",
            label: "返回顶部",
            navLabel: "返回顶部",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回顶部",
            body: "补间铺作重新回到后室顶部整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_ceiling",
              title: "返回顶部",
              body: "后室顶部重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_ceiling_small_bracket_closeup: {
        id: "rear_ceiling_small_bracket_closeup",
        title: "后室室顶小铺作近景",
        image: {
          src: "assets/M1/15_后室_顶部隅角及其他/插图一四 第一号墓后室室顶小铺作.png",
          alt: "第一号墓后室室顶小铺作",
          width: 2304,
          height: 1728
        },
        hotspots: [
          {
            id: "rear_ceiling_small_bracket_detail",
            label: "室顶小铺作细部",
            shape: "rect",
            rect: [0.2, 0.08, 0.8, 0.62],
            title: "室顶小铺作细部",
            body: "室顶小铺作排列在顶部过渡带。\n构件分布较密，与下方补间铺作层级不同。",
            record: "室顶小铺作排列在顶部过渡带，构件分布较密。",
            sourceFile: "M1/15_后室_顶部隅角及其他/15_后室_顶部隅角及其他-热点坐标映射-v1.2.md",
            sourceClueId: "L17-HS-L17-02"
          },
          {
            id: "return_rear_ceiling_from_small_bracket",
            label: "返回顶部",
            navLabel: "返回顶部",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回顶部",
            body: "室顶小铺作重新回到后室顶部整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_ceiling",
              title: "返回顶部",
              body: "后室顶部重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_north: {
        id: "rear_north",
        title: "第一号墓后室北壁",
        image: {
          src: "assets/M1/10_后室_北壁/第一号墓后室北壁(原色版，彭华士摄).png",
          alt: "第一号墓后室北壁",
          width: 1802,
          height: 1681
        },
        hotspots: [
          {
            id: "rear_wall_overview",
            label: "后室北壁",
            shape: "rect",
            rect: [0.12, 0.1, 0.88, 0.82],
            title: "后室北壁",
            body: "后室北壁正中为砖砌假门，假门前方为砖雕少女。",
            record: "后室北壁正中为砖砌假门，假门前方为砖雕少女。",
            sourceFile: "M1/10_后室_北壁/10_后室_北壁-增强线索表-v1.1.md",
            sourceClueId: "L02"
          },
          {
            id: "woman_door",
            label: "妇人启门",
            shape: "rect",
            rect: [0.28, 0.2, 0.72, 0.72],
            title: "妇人启门",
            body: "后室北壁假门中央，一妇人侧身立于门扇之后。\n右手扶门的位置偏低，手指扣在门缘处。\n门扇开启缝隙约宽一指。",
            record: "妇人侧身立于门扇之后，右手扶门位置偏低，门缝约宽一指。",
            sourceFile: "M1/10_后室_北壁/10_后室_北壁-增强线索表-v1.1.md",
            sourceClueId: "L02",
            closeupTransition: {
              targetViewId: "rear_woman_closeup",
              title: "假门特征",
              body: "假门外砌上额、𣏢柱，\n内砌门额、立颊、地栿。\n门额上雕砖作门簪四枚：外侧两枚作四瓣蒂形较大，内侧两枚作圆形较小。\n地栿两端各砌门砧一枚.",
              closeLabel: "靠近"
            }
          },
          {
            id: "land_deed",
            label: "地券",
            shape: "rect",
            rect: [0.18, 0.84, 0.42, 1],
            title: "地券",
            body: "后室砖床南端出土地券。\n券文朱书于青砖表面。\n文字行列清楚，局部墨色与砖面色层不同。",
            record: "后室砖床南端出土地券，券文朱书于青砖表面。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L03",
            closeupTransition: {
              targetViewId: "rear_land_deed_closeup",
              title: "靠近观察地券",
              body: "地券券文被放大。\n朱书行列和砖面色层可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "bones_nails",
            label: "人骨与铁钉",
            shape: "rect",
            rect: [0.42, 0.84, 0.62, 1],
            title: "人骨与铁钉",
            body: "后室砖床上见人骨与铁钉。\n人骨方向并不完全一致，铁钉散布于四角附近。\n骨骼、钉孔与砖床边线可以同时观察。",
            record: "后室砖床上见人骨与铁钉，人骨方向不完全一致，铁钉散布于四角附近。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L04",
            closeupTransition: {
              targetViewId: "rear_bones_nails_closeup",
              title: "门下面好像有人骨.....",
              body: "依稀可见人骨痕迹....",
              closeLabel: "靠近"
            }
          },
          {
            id: "find_distribution",
            label: "出土物分布图",
            shape: "rect",
            rect: [0.62, 0.84, 0.82, 1],
            title: "好像有一张墓室的出土物俯视图",
            body: "出土物分布图标出后室内遗物位置。\n人骨、铁钉与砖床边界同时出现。\n图中遗物分布集中在砖床范围内。",
            record: "出土物分布图标出后室内人骨、铁钉与砖床边界。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L04",
            closeupTransition: {
              targetViewId: "rear_distribution_closeup",
              title: "好像有一张墓室的出土物俯视图",
              body: "粟柏年给你了一张出土物俯视图。",
              closeLabel: "查看"
            }
          },
          {
            id: "return_passage",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            shape: "rect",
            rect: [0, 0.84, 0.16, 1],
            title: "返回入口总览",
            body: "后室入口总览仍在身后。\n已经记录的信息会保留。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回入口总览",
              body: "后室入口总览重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_woman_closeup: {
        id: "rear_woman_closeup",
        title: "妇人启门近景",
        image: {
          src: "assets/M1/10_后室_北壁/第一号墓后室北壁假门外的妇女雕像.png",
          alt: "第一号墓后室北壁假门外的妇女雕像",
          width: 1583,
          height: 2557
        },
        hotspots: [
          {
            id: "woman_hand",
            label: "妇人右手",
            shape: "rect",
            rect: [0.28, 0.34, 0.72, 0.62],
            title: "妇人右手",
            body: "女子右手推门，呈欲出还进之态。\n疑其取意在于表示假门之后尚有庭院或房屋、厅堂，\n亦即表示墓室至此并未到尽头之意。\n是北宋至金代常见的墓葬题材。",
            record: "女子右手推门，呈欲出还进之态。\n疑其取意在于表示假门之后尚有庭院或房屋、厅堂，\n亦即表示墓室至此并未到尽头之意。\n是北宋至金代常见的墓葬题材。",
            sourceFile: "M1/10_后室_北壁/10_后室_北壁-增强线索表-v1.1.md",
            sourceClueId: "H08"
          },
          {
            id: "door_gap",
            label: "妇女启门细节",
            shape: "rect",
            rect: [0.36, 0.18, 0.82, 0.82],
            title: "妇女启门细节",
            body: "砖雕妇女扎垂双髻少女发式\n着窄袖衫和长裙，裙下露出尖鞋，\n面南立于北壁假门之外。\n右手作启门状。",
            record: "砖雕妇女扎垂双髻少女发式\n着窄袖衫和长裙，裙下露出尖鞋，\n面南立于北壁假门之外。\n右手作启门状。",
            sourceFile: "M1/10_后室_北壁/10_后室_北壁-增强线索表-v1.1.md",
            sourceClueId: "L02"
          },
          {
            id: "return_rear_north_from_woman",
            label: "返回后室北壁",
            navLabel: "返回后室北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回后室北壁",
            body: "妇人启门重新回到假门整体中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_north",
              title: "返回后室北壁",
              body: "后室北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_land_deed_closeup: {
        id: "rear_land_deed_closeup",
        title: "地券近景",
        image: {
          src: "assets/M1/16_出土器物与人骨/地券.png",
          alt: "第一号墓地券",
          width: 1680,
          height: 1979
        },
        hotspots: [
          {
            id: "land_deed_text",
            label: "地券券文",
            shape: "rect",
            rect: [0.18, 0.18, 0.82, 0.7],
            title: "地券券文",
            body: "地券为砖制，出土时斜倚在后室北壁假门前，\n券面向南。\n上端斜杀二角。\n券面朱书十六行，文字多漫漶 。",
            record: "地券为砖制，出土时斜倚在后室北壁假门前，\n券面向南。\n上端斜杀二角。\n券面朱书十六行，文字多漫漶 。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L03"
          },
          {
            id: "land_deed_lines",
            label: "字迹",
            shape: "rect",
            rect: [0.18, 0.56, 0.82, 0.9],
            title: "字迹",
            body: "字迹已模糊不清。录文如下：大宋元符二年九月十□日赵\n□□女青律令□合□□\n□□吏自□其间主人内外存亡□皆\n□□□□□居者永避万里若违此\n□□□月□星？保人今曰真符故气邪精不\n□□□□自工匠修营安厝已后永保休宁\n□□□□□牢酒飰百味香新共为信□\n□□□□□若辄干犯诃禁者将军亭长□□\n□□□□□□界畔道路将军齐安？整隋？千□□□\n□□□□□□至□□内方勾□分擘掌四□□\n东西广十九步南北长二十二步东至青龙西至□□□□□□□□□□□贯文兼五彩信□买□□\n□□□□□□□□□将？下？曲？□□□□□□□\n□□□□□□□□□□□□监□□□□□□□\n□□□□□□□□□□□□□□□□□",
            record: "字迹已模糊不清。录文如下：大宋元符二年九月十□日赵\n□□女青律令□合□□\n□□吏自□其间主人内外存亡□皆\n□□□□□居者永避万里若违此\n□□□月□星？保人今曰真符故气邪精不\n□□□□自工匠修营安厝已后永保休宁\n□□□□□牢酒飰百味香新共为信□\n□□□□□若辄干犯诃禁者将军亭长□□\n□□□□□□界畔道路将军齐安？整隋？千□□□\n□□□□□□至□□内方勾□分擘掌四□□\n东西广十九步南北长二十二步东至青龙西至□□□□□□□□□□□贯文兼五彩信□买□□\n□□□□□□□□□将？下？曲？□□□□□□□\n□□□□□□□□□□□□监□□□□□□□\n□□□□□□□□□□□□□□□□□",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L03"
          },
          {
            id: "return_rear_north_from_deed",
            label: "返回后室北壁",
            navLabel: "返回后室北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回后室北壁",
            body: "地券位置重新回到后室空间中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_north",
              title: "返回后室北壁",
              body: "后室北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_bones_nails_closeup: {
        id: "rear_bones_nails_closeup",
        title: "人骨与铁钉近景",
        image: {
          src: "assets/M1/16_出土器物与人骨/人骨和部分铁钉.png",
          alt: "第一号墓人骨和部分铁钉",
          width: 2338,
          height: 1601
        },
        hotspots: [
          {
            id: "bones_direction",
            label: "人骨位置",
            shape: "rect",
            rect: [0.08, 0.18, 0.62, 0.78],
            title: "人骨位置",
            body: "人骨位于后室第二层砖床正中偏北，\n两具，二头骨在西侧。\n男北、女南，面皆向东。\n其余骨骼混堆在二头骨之东。\n无完整木棺，但四周有铁钉排列。",
            record: "人骨位于后室第二层砖床正中偏北，\n两具，二头骨在西侧。\n男北、女南，面皆向东。\n其余骨骼混堆在二头骨之东。\n无完整木棺，但四周有铁钉排列。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L04"
          },
          {
            id: "nail_count",
            label: "铁钉数量",
            shape: "rect",
            rect: [0.48, 0.2, 0.92, 0.82],
            title: "铁钉数量",
            body: "人骨四周置铁钉十九枚，排列成行。\n人骨的位置在铁钉范围内的北部。\n铁钉范围内略存灰烬，当为原有木制葬具朽毁后所遗之痕迹。\n排列地面的铁钉原应钉装在葬具之上。",
            record: "人骨四周置铁钉十九枚，排列成行。\n人骨的位置在铁钉范围内的北部。\n铁钉范围内略存灰烬，当为原有木制葬具朽毁后所遗之痕迹。\n排列地面的铁钉原应钉装在葬具之上。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "H09"
          },
          {
            id: "return_rear_north_from_bones",
            label: "返回后室北壁",
            navLabel: "返回后室北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回后室北壁",
            body: "人骨与铁钉重新回到砖床空间中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_north",
              title: "返回后室北壁",
              body: "后室北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      rear_distribution_closeup: {
        id: "rear_distribution_closeup",
        title: "出土物分布图",
        image: {
          src: "assets/M1/16_出土器物与人骨/M1出土物分布图.png",
          alt: "M1出土物分布图",
          width: 1535,
          height: 2286
        },
        hotspots: [
          {
            id: "distribution_map",
            label: "分布图整体",
            shape: "rect",
            rect: [0.08, 0.08, 0.92, 0.92],
            title: "分布图整体",
            body: "分布图标出后室砖床、人骨与铁钉位置。\n人骨集中在砖床范围内，铁钉分散于四角附近。\n图中遗物与砖床边界关系清楚。",
            record: "分布图标出后室砖床、人骨与铁钉位置，遗物与砖床边界关系清楚。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L04"
          },
          {
            id: "return_rear_north_from_distribution",
            label: "返回后室北壁",
            navLabel: "返回后室北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回后室北壁",
            body: "出土物位置重新回到后室整体空间中。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_north",
              title: "返回后室北壁",
              body: "后室北壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      }
    }
  },
  front_chamber: {
    id: "front_chamber",
    title: "第一号墓前室",
    startViewId: "front_overview",
    views: {
      front_overview: {
        id: "front_overview",
        title: "第一号墓前室入口总览",
        image: {
          src: "assets/M1/17_补充总览图/P0-2B_前室北壁过道方向总览图.png",
          alt: "第一号墓前室北壁过道方向总览图",
          width: 1672,
          height: 941
        },
        hotspots: [
          {
            id: "overview_return_corridor",
            label: "返回甬道",
            navLabel: "返回甬道",
            shape: "rect",
            rect: [0.02, 0.76, 0.24, 0.98],
            title: "返回甬道",
            body: "身后的甬道仍可复查。\n前室入口总览会保留在当前位置。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "corridor",
              targetViewId: "corridor_overview",
              unlocked: true,
              title: "返回甬道",
              body: "你退回甬道总览。\n前室入口仍可再次进入。",
              closeLabel: "返回"
            }
          },
          {
            id: "overview_turn_west",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0.04, 0.26, 0.32, 0.74],
            title: "转向西壁",
            body: "前室西壁进入视线。\n器物与砖雕集中在这一侧墙面。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "前室西壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "overview_turn_east",
            label: "转向东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.68, 0.26, 0.96, 0.74],
            title: "转向东壁",
            body: "前室东壁进入视线。\n人物图像集中在这一侧墙面。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "前室东壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "overview_turn_south",
            label: "转向南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.30, 0.66, 0.70, 0.96],
            title: "转向南壁",
            body: "前室南壁位于入口一侧。\n壁函与倚柱彩画可继续查看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "前室南壁进入视线。",
              closeLabel: "转向"
            }
          },
          {
            id: "overview_turn_north",
            label: "北壁与过道方向",
            navLabel: "北壁/过道方向",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.34, 0.38, 0.66, 0.66],
            title: "北壁与过道方向",
            body: "北壁中下部的暗缝和地面轴线指向过道方向。\n过道入口位于北壁下方，前室各壁面与顶部仍可从入口总览重新进入。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "转向北壁与过道方向",
              body: "前室北壁西部进入视线。\n注意北壁中下部的竖向暗缝：这里是前室通向过道的方向。看全前室主要信息后，点击下方“进入过道”。",
              closeLabel: "转向"
            }
          },
          {
            id: "overview_look_ceiling",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.18, 0.04, 0.82, 0.26],
            title: "抬头看顶部",
            body: "前室顶部结构位于视线之上。\n补间铺作可继续查看。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室顶部进入视线。",
              closeLabel: "抬头"
            }
          }
        ]
      },
      front_west: {
        id: "front_west",
        title: "第一号墓前室西壁",
        image: {
          src: "assets/M1/05_前室_西壁/. 第一号墓前室西壁壁画(原色版，彭华士摄).png",
          alt: "第一号墓前室西壁",
          width: 1774,
          height: 1490
        },
        hotspots: [
          {
            id: "return_corridor",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.02, 0.72, 0.22, 0.96],
            title: "返回入口总览",
            body: "回到前室入口总览。\n从总览可以重新选择各壁面和顶部；北壁中下部的暗缝仍指向过道方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_overview",
              title: "返回入口总览",
              body: "前室入口总览重新进入视线。\n各壁面与顶部仍可从总览重新进入；北壁中下部暗缝指向过道方向。",
              closeLabel: "返回"
            }
          },
          {
            id: "ewer",
            label: "砖砌注子",
            shape: "rect",
            rect: [0.38, 0.4, 0.56, 0.66],
            title: "砖砌注子",
            body: "前室西壁下部，砖雕注子嵌于壁面。\n实测高四寸，流口微翘，腹部圆鼓。\n该注子为北宋中期短流注子形制。",
            record: "前室西壁下部砖雕注子嵌于壁面，实测高四寸，流口微翘，腹部圆鼓，为北宋中期短流注子形制。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05",
            closeupTransition: {
              targetViewId: "front_west_ewer_closeup",
              title: "靠近观察注子",
              body: "注子的轮廓变得更清楚。\n流口、腹部和壁面接缝可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "high_bottle",
            label: "高瓶与瓶座",
            shape: "rect",
            rect: [0.58, 0.18, 0.78, 0.62],
            title: "高瓶与瓶座",
            body: "黑色瓶身，承以黄色小座，与宋人《胆瓶秋卉图》中的胆瓶和瓶座形制极似，是宋代流行的瓶型。",
            record: "黑色瓶身，承以黄色小座，与宋人《胆瓶秋卉图》中的胆瓶和瓶座形制极似，是宋代流行的瓶型。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05",
            closeupTransition: {
              targetViewId: "front_west_bottle_closeup",
              title: "靠近观察高瓶",
              body: "黑色瓶身，承以黄色小座。",
              closeLabel: "靠近"
            }
          },
          {
            id: "brick_table",
            label: "砖砌桌",
            shape: "rect",
            rect: [0.44, 0.62, 0.78, 0.86],
            title: "砖砌桌",
            body: "正中设一桌，桌上陈一注、二碗（下附托子），桌左右各设一椅，皆以砖砌出，浮出壁面约5厘米。\n桌的支柱和横木雕有凹入的线饰，桌上原敷彩色，现已脱落。",
            record: "正中设一桌，桌上陈一注、二碗（下附托子），桌左右各设一椅，皆以砖砌出，浮出壁面约5厘米。\n桌的支柱和横木雕有凹入的线饰，桌上原敷彩色，现已脱落。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L11",
            closeupTransition: {
              targetViewId: "front_west_table_closeup",
              title: "靠近观察砖砌桌",
              body: "靠近观察砖砌桌",
              closeLabel: "靠近"
            }
          },
          {
            id: "front_west_entry_relation",
            label: "前室入口关系",
            navLabel: "查看入口",
            shape: "rect",
            rect: [0.18, 0.58, 0.40, 0.92],
            title: "前室入口关系",
            body: "西壁中间下部可见前室入口图。\n入口图位于西壁下部，与通道方向相接。",
            record: "前室入口图位于西壁中间下部，与通道方向相接。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
            sourceClueId: "FRONT-E-01",
            viewTransition: {
              targetViewId: "front_west_entry_closeup",
              title: "查看前室入口关系",
              body: "前室入口关系近景进入视线。",
              closeLabel: "查看"
            }
          },
          {
            id: "turn_south_from_west",
            label: "转身观察南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.28, 0.04, 0.46, 0.2],
            title: "转向南壁",
            body: "前室南壁进入视线。\n入口附近分列着壁函，倚柱彩画位于其间。",
            record: "前室南壁可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "入口附近的壁函与倚柱进入视线。",
              closeLabel: "转身"
            }
          },
          {
            id: "turn_north_from_west",
            label: "转身观察北壁",
            navLabel: "转向北壁",
            shape: "rect",
            rect: [0.48, 0.04, 0.68, 0.2],
            title: "转向北壁",
            body: "前室北壁进入视线。\n东西两段壁画分别保存在相邻画面中。",
            record: "前室北壁可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "转向北壁",
              body: "北壁西部壁画进入视线。",
              closeLabel: "转身"
            }
          },
          {
            id: "look_ceiling_from_west",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.7, 0.02, 0.96, 0.16],
            title: "抬头看顶部",
            body: "前室西北角顶部图进入视线。\n转角构件、壁面上缘和墓顶交接线可以继续查看。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室西北角顶部图进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "turn_east",
            label: "转身观察东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.82, 0.18, 0.98, 0.86],
            title: "转向东壁",
            body: "西壁器物已经记录。\n前室另一侧仍有人物成组出现。",
            record: "前室东壁可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "前室另一侧的人物图像进入视线。",
              closeLabel: "转身"
            }
          }
        ]
      },
      front_west_entry_closeup: {
        id: "front_west_entry_closeup",
        title: "前室西壁入口关系",
        image: {
          src: "assets/M1/05_前室_西壁/第一号墓西壁中间下部一一前室入口.png",
          alt: "第一号墓西壁中间下部一一前室入口",
          width: 1622,
          height: 2092
        },
        hotspots: [
          {
            id: "front_entry_relation_detail",
            label: "入口与西壁关系",
            shape: "rect",
            rect: [0.18, 0.12, 0.82, 0.78],
            title: "入口与西壁关系",
            body: "前室入口位于西壁下部。\n前室处在甬道、过道之间的中段空间。",
            record: "前室入口位于西壁下部，前室处在甬道、过道之间。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
            sourceClueId: "FRONT-E-01"
          },
          {
            id: "return_front_west_from_entry",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回前室西壁",
            body: "返回前室西壁主视图。",
            record: "返回前室西壁主视图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "视角回到前室西壁。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_east: {
        id: "front_east",
        title: "第一号墓前室东壁",
        image: {
          src: "assets/M1/04_前室_东壁/第一号墓前室东壁壁画(原色版，彭华士摄).png",
          alt: "第一号墓前室东壁",
          width: 2256,
          height: 1330
        },
        hotspots: [
          {
            id: "return_overview_from_east",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.72, 0.84, 0.98, 0.98],
            title: "返回入口总览",
            body: "回到前室入口总览。\n从总览可以重新选择各壁面和顶部；北壁中下部的暗缝仍指向过道方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_overview",
              title: "返回入口总览",
              body: "前室入口总览重新进入视线。\n各壁面与顶部仍可从总览重新进入；北壁中下部暗缝指向过道方向。",
              closeLabel: "返回"
            }
          },
          {
            id: "female_musicians",
            label: "女乐图像",
            shape: "rect",
            rect: [0.14, 0.18, 0.76, 0.82],
            title: "女乐图像",
            body: "此壁右侧五人面北，左侧五人面南，中间舞女面东。\n女乐所执乐器（觱篥、箫、笛、笙、琵琶、腰鼓、拍板等）与《辽史》所记辽代散乐器几乎一致。",
            record: "此壁右侧五人面北，左侧五人面南，中间舞女面东。\n女乐所执乐器（觱篥、箫、笛、笙、琵琶、腰鼓、拍板等）与《辽史》所记辽代散乐器几乎一致。",
            sourceFile: "M1/04_前室_东壁/04_前室_东壁-增强线索表-v1.1.md",
            sourceClueId: "L18"
          },
          {
            id: "east_wall_surface",
            label: "东壁画面",
            shape: "rect",
            rect: [0.2, 0.08, 0.9, 0.26],
            title: "东壁画面",
            body: "阑额下用砖砌出卷起的竹帘，帘着土黄色，缀以绛心赭色小花，帘两端各画银钩。\n卷帘下有雕砖悬幔，着绛色。\n幔下有女乐十一人，分为左右两排，中间一女子起舞。\n右侧五人面北，左侧五人面南，中间舞女面东，\n整体呈向心式布局，共同配合中间舞者，演奏大曲。",
            record: "阑额下用砖砌出卷起的竹帘，帘着土黄色，缀以绛心赭色小花，帘两端各画银钩。\n卷帘下有雕砖悬幔，着绛色。\n幔下有女乐十一人，分为左右两排，中间一女子起舞。\n右侧五人面北，左侧五人面南，中间舞女面东，\n整体呈向心式布局，共同配合中间舞者，演奏大曲。",
            sourceFile: "M1/04_前室_东壁/04_前室_东壁-增强线索表-v1.1.md",
            sourceClueId: "H07"
          },
          {
            id: "pointed_shoes",
            label: "女乐尖鞋",
            shape: "rect",
            rect: [0.18, 0.66, 0.58, 0.96],
            title: "女乐尖鞋",
            body: "击腰鼓的女乐所着的尖鞋，是出于配合女乐的足踏节拍的目的。\n尖鞋在唐代多出现于歌舞伎乐，至北宋晚期已从特定表演服饰扩展为贵族女眷日常常服。",
            record: "击腰鼓的女乐所着的尖鞋，是出于配合女乐的足踏节拍的目的。\n尖鞋在唐代多出现于歌舞伎乐，至北宋晚期已从特定表演服饰扩展为贵族女眷日常常服。。",
            sourceFile: "M1/04_前室_东壁/04_前室_东壁-增强线索表-v1.1.md",
            sourceClueId: "H06",
            closeupTransition: {
              targetViewId: "front_east_shoes_closeup",
              title: "靠近观察尖鞋",
              body: "女乐尖鞋细部被单独放大。\n鞋尖轮廓突出。\n衣裙下缘与鞋面交界处仍可辨认。",
              closeLabel: "靠近"
            }
          },
          {
            id: "turn_south_from_east",
            label: "转身观察南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.62, 0.04, 0.82, 0.22],
            title: "转向南壁",
            body: "前室南壁进入视线。\n壁函、倚柱和彩画边线沿入口附近展开。",
            record: "前室南壁可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "入口附近的壁函与倚柱进入视线。",
              closeLabel: "转身"
            }
          },
          {
            id: "turn_north_from_east",
            label: "转身观察北壁",
            navLabel: "转向北壁",
            shape: "rect",
            rect: [0.38, 0.04, 0.58, 0.22],
            title: "转向北壁",
            body: "前室北壁进入视线。\n东西两段画面保存为相邻的壁画图像。",
            record: "前室北壁可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "转向北壁",
              body: "北壁西部壁画进入视线。",
              closeLabel: "转身"
            }
          },
          {
            id: "look_ceiling_from_east",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.72, 0.02, 0.96, 0.18],
            title: "抬头看顶部",
            body: "前室西北角顶部图进入视线。\n转角构件、壁面上缘和墓顶交接线可以继续查看。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室西北角顶部图进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "return_west",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0.02, 0.18, 0.18, 0.86],
            title: "转向西壁",
            body: "东壁人物已经记录。\n西壁器物线可以继续查看。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁器物重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          }
        ]
      },
      front_south: {
        id: "front_south",
        title: "第一号墓前室南壁",
        image: {
          src: "assets/M1/06_前室_南壁/第一号墓前室南壁壁画.png",
          alt: "第一号墓前室南壁壁画",
          width: 1604,
          height: 2191
        },
        hotspots: [
          {
            id: "return_overview_from_south",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.34, 0.84, 0.66, 0.99],
            title: "返回入口总览",
            body: "回到前室入口总览。\n从总览可以重新选择各壁面和顶部；北壁中下部的暗缝仍指向过道方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_overview",
              title: "返回入口总览",
              body: "前室入口总览重新进入视线。\n各壁面与顶部仍可从总览重新进入；北壁中下部暗缝指向过道方向。",
              closeLabel: "返回"
            }
          },
          {
            id: "south_wall_overview",
            label: "南壁整体",
            shape: "rect",
            rect: [0.14, 0.16, 0.86, 0.84],
            title: "南壁入口东侧",
            body: "阑额下绘绛色悬幔、蓝色组绶。幔下二人面西立：\n前者系皂巾，着圆领窄袖四䙆蓝衫，左肩负钱贯,似为甬道东壁贡纳者入门后侍候；\n后者冠着同前，着赭衫，双手持骨朵（侍卫）。",
            record: "阑额下绘绛色悬幔、蓝色组绶。幔下二人面西立：\n前者系皂巾，着圆领窄袖四䙆蓝衫，左肩负钱贯,似为甬道东壁贡纳者入门后侍候；\n后者冠着同前，着赭衫，双手持骨朵（侍卫）。",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12"
          },
          {
            id: "east_wall_niche",
            label: "东部壁函",
            shape: "rect",
            rect: [0.08, 0.24, 0.42, 0.62],
            title: "东部壁函",
            body: "东部壁函位于南壁入口一侧。\n壁函外框与倚柱内缘之间约宽半指。\n外框边线、壁面底线和倚柱内缘可以同时观察。",
            record: "东部壁函外框距倚柱内缘约半指。",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12",
            closeupTransition: {
              targetViewId: "front_south_east_niche_closeup",
              title: "靠近观察东部壁函",
              body: "东部壁函外框与倚柱内缘被放大。\n两者之间的间距可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "west_wall_niche",
            label: "西部壁函",
            shape: "rect",
            rect: [0.58, 0.24, 0.92, 0.62],
            title: "西部壁函",
            body: "西部壁函位于南壁另一侧。\n壁函外框与倚柱内缘之间接近一指。\n与东部壁函相比，两侧间距不等。",
            record: "西部壁函外框距倚柱内缘接近一指，两侧间距不等。",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12",
            closeupTransition: {
              targetViewId: "front_south_west_niche_closeup",
              title: "靠近观察西部壁函",
              body: "西部壁函外框与倚柱内缘被放大。\n两者之间的间距可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "painted_column",
            label: "倚柱彩画",
            shape: "rect",
            rect: [0.36, 0.16, 0.64, 0.78],
            title: "倚柱彩画",
            body: "倚柱彩画柱身衬赭色地，柱头为墨线内画青晕半柿蒂，\n柱身画一整两破青晕梭身柿蒂，即对仗排列的柿子蒂形纹样，\n柱脚为仰莲样。\n《营造法式》记“柱头作细锦”“柱身内作梅及石榴等华”，正与此相同，\n是当时流行的细锦花纹之一种。",
            record: "倚柱彩画柱身衬赭色地，柱头为墨线内画青晕半柿蒂，\n柱身画一整两破青晕梭身柿蒂，即对仗排列的柿子蒂形纹样，\n柱脚为仰莲样。\n《营造法式》记“柱头作细锦”“柱身内作梅及石榴等华”，正与此相同，\n是当时流行的细锦花纹之一种。",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12",
            closeupTransition: {
              targetViewId: "front_south_column_closeup",
              title: "靠近观察倚柱彩画",
              body: "倚柱彩画的边缘与上下线条被放大。\n两侧壁函的对应关系可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "turn_north_from_south",
            label: "转身观察北壁",
            navLabel: "转向北壁",
            shape: "rect",
            rect: [0.36, 0.02, 0.64, 0.16],
            title: "转向北壁",
            body: "前室北壁进入视线。\n画面分为东西两段，保存状态和画面密度并不相同。",
            record: "前室北壁可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "转向北壁",
              body: "北壁西部壁画进入视线。",
              closeLabel: "转身"
            }
          },
          {
            id: "look_ceiling_from_south",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.66, 0.02, 0.92, 0.16],
            title: "抬头看顶部",
            body: "前室西北角顶部图进入视线。\n转角构件、壁面上缘和墓顶交接线可以继续查看。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室西北角顶部图进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "return_west_from_south",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0, 0.18, 0.18, 0.88],
            title: "转向西壁",
            body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_east_from_south",
            label: "转向东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.82, 0.18, 1, 0.88],
            title: "转向东壁",
            body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          }
        ]
      },
      front_north_west: {
        id: "front_north_west",
        title: "第一号墓前室北壁西部",
        image: {
          src: "assets/M1/07_前室_北壁/第一号墓前室北壁西部壁画.png",
          alt: "第一号墓前室北壁西部壁画",
          width: 1554,
          height: 2297
        },
        hotspots: [
          {
            id: "north_west_mural",
            label: "北壁西部画面",
            shape: "rect",
            rect: [0.12, 0.16, 0.88, 0.84],
            title: "北壁西部画面",
            body: "前室北壁西部，画面上端绘有绛色悬幔。\n悬幔下竖植二赭杆枪，以及一剑、一简（鞭类兵器）。",
            record: "前室北壁西部，画面上端绘有绛色悬幔。\n悬幔下竖植二赭杆枪，以及一剑、一简（鞭类兵器）。",
            sourceFile: "M1/07_前室_北壁/07_前室_北壁-增强线索表-v1.1.md",
            sourceClueId: "L21"
          },
          {
            id: "switch_north_east",
            label: "切换北壁东部",
            navLabel: "切换东部",
            shape: "rect",
            rect: [0.72, 0.18, 0.98, 0.86],
            title: "切换北壁东部",
            body: "北壁东部画面进入视线。\n两段壁画可以继续对照。",
            record: "切换至北壁东部。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_east",
              title: "切换北壁东部",
              body: "北壁东部画面进入视线。",
              closeLabel: "切换"
            }
          },
          {
            id: "front_chamber_exit_west",
            label: "过道入口",
            navLabel: "进入过道",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.38, 0.58, 0.62, 0.98],
            title: "北壁下方过道入口",
            body: "前室北壁下方通向过道方向。\n入口开放后可从此进入过道轴线。",
            record: "前室北壁下方确认了通向过道的方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              targetViewId: "passage_overview",
              completesSceneId: "front_chamber",
              title: "进入过道轴线",
              body: "前室四壁与顶部已经形成对应。\n北壁下方暗缝通向狭长过道轴线。",
              closeLabel: "进入",
              lockedBody: "过道入口暂未开放。前室各壁面与顶部的主要观察信息仍未齐全。",
              missingRecords: [
                { id: "front_chamber:ewer", label: "西壁：砖砌注子" },
                { id: "front_chamber:high_bottle", label: "西壁：高瓶与瓶座" },
                { id: "front_chamber:brick_table", label: "西壁：砖砌桌侧面" },
                { id: "front_chamber:female_musicians", label: "东壁：女乐图像" },
                { id: "front_chamber:south_wall_overview", label: "南壁：整体与入口分区" },
                { id: "front_chamber:east_wall_niche", label: "南壁：东部壁函" },
                { id: "front_chamber:west_wall_niche", label: "南壁：西部壁函" },
                { id: "front_chamber:painted_column", label: "南壁：倚柱彩画" },
                { id: "front_chamber:north_west_mural", label: "北壁：西部画面" },
                { id: "front_chamber:north_east_mural", label: "北壁：东部画面" },
                { id: "front_chamber:northwest_corner", label: "顶部：西北角构件" },
                { id: "front_chamber:bracket_set", label: "顶部：补间铺作近景" }
              ]
            }
          },
          {
            id: "look_ceiling_from_north_west",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.36, 0.02, 0.64, 0.16],
            title: "抬头看顶部",
            body: "前室西北角顶部图进入视线。\n转角构件、壁面上缘和墓顶交接线可以继续查看。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室西北角顶部图进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "return_overview_from_north_west",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.02, 0.02, 0.32, 0.16],
            title: "返回入口总览",
            body: "回到前室入口总览。\n各壁面与顶部仍可从总览重新进入；北壁中下部暗缝指向过道方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_overview",
              title: "返回入口总览",
              body: "前室入口总览重新进入视线。\n北壁中下部的暗缝仍是进入过道的方向。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_west_from_north_west",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0, 0.18, 0.18, 0.88],
            title: "转向西壁",
            body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_east_from_north_west",
            label: "转向东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.18, 0.86, 0.48, 1],
            title: "转向东壁",
            body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_south_from_north_west",
            label: "转向南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.52, 0.86, 0.82, 1],
            title: "转向南壁",
            body: "南壁的壁函与倚柱重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "南壁的壁函与倚柱重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          }
        ]
      },
      front_north_east: {
        id: "front_north_east",
        title: "第一号墓前室北壁东部",
        image: {
          src: "assets/M1/07_前室_北壁/第一号墓前室北壁东部.png",
          alt: "第一号墓前室北壁东部",
          width: 1663,
          height: 2182
        },
        hotspots: [
          {
            id: "north_east_mural",
            label: "北壁东部画面",
            shape: "rect",
            rect: [0.08, 0.16, 0.86, 0.84],
            title: "北壁东部画面",
            body: "北壁东侧画面上端绘有绛色悬幔。c悬挂兵器，现已漫漶，\n可依稀辨识者为一张盛以弓袋的弓，二枚箭，箭下似画箭箙。\n与北壁西部对称，共同构成墓室兵器陈设空间.",
            record: "北壁东侧画面上端绘有绛色悬幔。c悬挂兵器，现已漫漶，\n可依稀辨识者为一张盛以弓袋的弓，二枚箭，箭下似画箭箙。\n与北壁西部对称，共同构成墓室兵器陈设空间.",
            sourceFile: "M1/07_前室_北壁/07_前室_北壁-增强线索表-v1.1.md",
            sourceClueId: "L21"
          },
          {
            id: "switch_north_west",
            label: "切换北壁西部",
            navLabel: "切换西部",
            shape: "rect",
            rect: [0, 0.18, 0.28, 0.86],
            title: "切换北壁西部",
            body: "北壁西部画面重新进入视线。\n两段壁画可以继续对照。",
            record: "切换至北壁西部。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "切换北壁西部",
              body: "北壁西部画面重新进入视线。",
              closeLabel: "切换"
            }
          },
          {
            id: "front_chamber_exit_east",
            label: "过道入口",
            navLabel: "进入过道",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.38, 0.58, 0.62, 0.98],
            title: "北壁下方过道入口",
            body: "前室北壁下方通向过道方向。\n入口开放后可从此进入过道轴线。",
            record: "前室北壁下方确认了通向过道的方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              targetViewId: "passage_overview",
              completesSceneId: "front_chamber",
              title: "进入过道轴线",
              body: "前室四壁与顶部已经形成对应。\n北壁下方暗缝通向狭长过道轴线。",
              closeLabel: "进入",
              lockedBody: "过道入口暂未开放。前室各壁面与顶部的主要观察信息仍未齐全。",
              missingRecords: [
                { id: "front_chamber:ewer", label: "西壁：砖砌注子" },
                { id: "front_chamber:high_bottle", label: "西壁：高瓶与瓶座" },
                { id: "front_chamber:brick_table", label: "西壁：砖砌桌侧面" },
                { id: "front_chamber:female_musicians", label: "东壁：女乐图像" },
                { id: "front_chamber:south_wall_overview", label: "南壁：整体与入口分区" },
                { id: "front_chamber:east_wall_niche", label: "南壁：东部壁函" },
                { id: "front_chamber:west_wall_niche", label: "南壁：西部壁函" },
                { id: "front_chamber:painted_column", label: "南壁：倚柱彩画" },
                { id: "front_chamber:north_west_mural", label: "北壁：西部画面" },
                { id: "front_chamber:north_east_mural", label: "北壁：东部画面" },
                { id: "front_chamber:northwest_corner", label: "顶部：西北角构件" },
                { id: "front_chamber:bracket_set", label: "顶部：补间铺作近景" }
              ]
            }
          },
          {
            id: "look_ceiling_from_north_east",
            label: "抬头看顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.36, 0.02, 0.64, 0.16],
            title: "抬头看顶部",
            body: "前室西北角顶部图进入视线。\n转角构件、壁面上缘和墓顶交接线可以继续查看。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室西北角顶部图进入视线。",
              closeLabel: "抬头"
            }
          },
          {
            id: "return_overview_from_north_east",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.02, 0.02, 0.32, 0.16],
            title: "返回入口总览",
            body: "回到前室入口总览。\n各壁面与顶部仍可从总览重新进入；北壁中下部暗缝指向过道方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_overview",
              title: "返回入口总览",
              body: "前室入口总览重新进入视线。\n北壁中下部的暗缝仍是进入过道的方向。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_west_from_north_east",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0, 0.86, 0.28, 1],
            title: "转向西壁",
            body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_east_from_north_east",
            label: "转向东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.34, 0.86, 0.64, 1],
            title: "转向东壁",
            body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_south_from_north_east",
            label: "转向南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.7, 0.86, 1, 1],
            title: "转向南壁",
            body: "南壁的壁函与倚柱重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "南壁的壁函与倚柱重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          }
        ]
      },
      front_ceiling: {
        id: "front_ceiling",
        title: "第一号墓前室西北角顶部",
        image: {
          src: "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
          alt: "第一号墓西北角",
          width: 1920,
          height: 1849
        },
        hotspots: [
          {
            id: "northwest_corner",
            label: "西北角构件",
            shape: "rect",
            rect: [0.30, 0.08, 0.92, 0.86],
            title: "西北角构件",
            body: "内转角铺作，是全墓最繁杂的铺作.\n顶部彩绘以赭、青、白三主色为主，间用淡黄和墨绿，属于“装銮彩画”，即“朱地间诸华”。\n栱画青晕柿蒂或赭青两色相间的斜格纹；昂底、昂面画赭心方胜；\n斗衬赭地，其上画青晕仰莲或半柿蒂；素方画赭地青晕柿蒂。",
            record: "内转角铺作，是全墓最繁杂的铺作.\n顶部彩绘以赭、青、白三主色为主，间用淡黄和墨绿，属于“装銮彩画”，即“朱地间诸华”。\n栱画青晕柿蒂或赭青两色相间的斜格纹；昂底、昂面画赭心方胜；\n斗衬赭地，其上画青晕仰莲或半柿蒂；素方画赭地青晕柿蒂。",
            sourceFile: "M1/08_前室_顶部隅角及其他/08_前室_顶部隅角及其他-增强线索表-v1.1.md",
            sourceClueId: "L13",
            closeupTransition: {
              targetViewId: "front_ceiling_northwest_closeup",
              title: "靠近观察补间铺作",
              body: "补间铺作近景被打开。\n构件层级和壁面上缘可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "return_overview_from_ceiling",
            label: "返回入口总览",
            navLabel: "返回入口总览",
            navLabelAlwaysVisible: true,
            navLabelEmphasis: true,
            shape: "rect",
            rect: [0.02, 0.02, 0.18, 0.16],
            title: "返回入口总览",
            body: "回到前室入口总览。\n从总览可以重新选择各壁面和顶部；北壁中下部的暗缝仍指向过道方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_overview",
              title: "返回入口总览",
              body: "前室入口总览重新进入视线。\n各壁面与顶部仍可从总览重新进入；北壁中下部暗缝指向过道方向。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_west_from_ceiling",
            label: "转向西壁",
            navLabel: "转向西壁",
            shape: "rect",
            rect: [0, 0.78, 0.25, 1],
            title: "转向西壁",
            body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_east_from_ceiling",
            label: "转向东壁",
            navLabel: "转向东壁",
            shape: "rect",
            rect: [0.25, 0.78, 0.5, 1],
            title: "转向东壁",
            body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_south_from_ceiling",
            label: "转向南壁",
            navLabel: "转向南壁",
            shape: "rect",
            rect: [0.5, 0.78, 0.75, 1],
            title: "转向南壁",
            body: "南壁的壁函与倚柱重新进入视线。\n入口总览仍可从当前视图返回。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "南壁的壁函与倚柱重新进入视线。\n入口总览仍可从当前视图返回。",
              closeLabel: "转向"
            }
          },
          {
            id: "return_north_from_ceiling",
            label: "转向北壁",
            navLabel: "转向北壁",
            shape: "rect",
            rect: [0.75, 0.78, 1, 1],
            title: "转向北壁",
            body: "北壁西部壁画重新进入视线。\n北壁下方仍是通向过道的方向。",
            record: "返回前室北壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "转向北壁",
              body: "北壁西部壁画重新进入视线。\n北壁下方仍是通向过道的方向。",
              closeLabel: "转向"
            }
          }
        ]
      },
      front_ceiling_northwest_closeup: {
        id: "front_ceiling_northwest_closeup",
        title: "前室补间铺作近景",
        image: {
          src: "assets/M1/08_前室_顶部隅角及其他/插图七 第一号墓前室补间铺作.png",
          alt: "第一号墓前室补间铺作",
          width: 2386,
          height: 1495
        },
        hotspots: [
          {
            id: "bracket_set",
            label: "补间铺作",
            shape: "rect",
            rect: [0.24, 0.10, 0.78, 0.88],
            title: "补间铺作",
            body: "转角铺作细节为：栌斗口衔正侧面泥道栱、正侧面昂和角缝的角昂；\n正面泥道栱上砌柱头方，侧面柱头方雕作连隐慢栱；正面昂上砌令栱，令栱外端与角昂上的耍头相交，并伸至侧面磨解作耍头样；\n侧面昂上也砌出令栱，令栱外端伸至正面，与正面的令栱作法相同。",
            record: "转角铺作细节为：栌斗口衔正侧面泥道栱、正侧面昂和角缝的角昂；\n正面泥道栱上砌柱头方，侧面柱头方雕作连隐慢栱；正面昂上砌令栱，令栱外端与角昂上的耍头相交，并伸至侧面磨解作耍头样；\n侧面昂上也砌出令栱，令栱外端伸至正面，与正面的令栱作法相同。",
            sourceFile: "M1/08_前室_顶部隅角及其他/08_前室_顶部隅角及其他-增强线索表-v1.1.md",
            sourceClueId: "L13"
          },
          {
            id: "return_front_ceiling_from_corner",
            label: "返回顶部",
            navLabel: "返回顶部",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回顶部",
            body: "返回前室西北角顶部图。",
            record: "返回前室西北角顶部图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "返回顶部",
              body: "前室西北角顶部图重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_south_east_niche_closeup: {
        id: "front_south_east_niche_closeup",
        title: "东部壁函近景",
        image: {
          src: "assets/M1/06_前室_南壁/第一号墓前室南壁东部壁函画(彭华士摄).png",
          alt: "第一号墓前室南壁东部壁函画",
          width: 1492,
          height: 2348
        },
        hotspots: [
          {
            id: "east_niche_frame",
            label: "东部壁函外框",
            shape: "rect",
            rect: [0.06, 0.2, 0.44, 0.78],
            title: "东部壁函外框",
            body: "东部壁函位于南壁入口一侧。\n壁函外框与倚柱内缘之间约宽半指。\n外框边线与壁面底线仍可辨认。",
            record: "东部壁函外框距倚柱内缘约半指，外框边线与壁面底线可辨认。",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12"
          },
          {
            id: "return_front_south_from_east_niche",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回南壁",
            body: "东部壁函细部已经记录。\n南壁整体重新进入视线。",
            record: "完成东部壁函近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "返回南壁",
              body: "南壁整体重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_south_west_niche_closeup: {
        id: "front_south_west_niche_closeup",
        title: "西部壁函近景",
        image: {
          src: "assets/M1/06_前室_南壁/第一号墓前室南壁西部壁函(彭华士摄).png",
          alt: "第一号墓前室南壁西部壁函",
          width: 1338,
          height: 2120
        },
        hotspots: [
          {
            id: "west_niche_frame",
            label: "西部壁函外框",
            shape: "rect",
            rect: [0.56, 0.2, 0.94, 0.78],
            title: "西部壁函外框",
            body: "西部壁函位于南壁另一侧。\n壁函外框与倚柱内缘之间接近一指。\n外框上沿较东部对应位置略高。",
            record: "西部壁函外框距倚柱内缘接近一指，外框上沿较东部对应位置略高。",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12"
          },
          {
            id: "return_front_south_from_west_niche",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回南壁",
            body: "西部壁函细部已经记录。\n南壁整体重新进入视线。",
            record: "完成西部壁函近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "返回南壁",
              body: "南壁整体重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_south_column_closeup: {
        id: "front_south_column_closeup",
        title: "倚柱彩画近景",
        image: {
          src: "assets/M1/06_前室_南壁/第一号墓前室南壁倚柱彩画.png",
          alt: "第一号墓前室南壁倚柱彩画",
          width: 1958,
          height: 1331
        },
        hotspots: [
          {
            id: "column_painting_edge",
            label: "倚柱彩画细节",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.72],
            title: "倚柱彩画细节",
            body: "前室入口两侧的倚柱壁面。\n左侧为立柱，柱身可见青晕梭身柿蒂纹（衬赭地），柱头或柱脚有青晕仰莲或半柿蒂装饰。\n右侧为阑额或壁面，绘有卷草（墨画卷草）、四半方胜或宝相花等传统纹样，中心有莲花状图案.",
            record: "前室入口两侧的倚柱壁面。\n左侧为立柱，柱身可见青晕梭身柿蒂纹（衬赭地），柱头或柱脚有青晕仰莲或半柿蒂装饰。\n右侧为阑额或壁面，绘有卷草（墨画卷草）、四半方胜或宝相花等传统纹样，中心有莲花状图案",
            sourceFile: "M1/06_前室_南壁/06_前室_南壁-增强线索表-v1.1.md",
            sourceClueId: "L12"
          },
          {
            id: "return_front_south_from_column",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回南壁",
            body: "倚柱彩画细部已经记录。\n南壁整体重新进入视线。",
            record: "完成倚柱彩画近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "返回南壁",
              body: "南壁整体重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_west_bottle_closeup: {
        id: "front_west_bottle_closeup",
        title: "高瓶与瓶座近景",
        image: {
          src: "assets/M1/05_前室_西壁/第一号墓前室西壁壁画中的高瓶和瓶座（正确）.png",
          alt: "高瓶与瓶座近景",
          width: 830,
          height: 1484
        },
        hotspots: [
          {
            id: "bottle_body",
            label: "高瓶瓶身",
            shape: "rect",
            rect: [0.28, 0.08, 0.72, 0.5],
            title: "高瓶瓶身",
            body: "案上高瓶立于瓶座之上。\n瓶身修长，下接瓶座。\n细量瓶座总高，与注子相近。",
            record: "高瓶立于瓶座之上，瓶身修长；瓶座总高与注子相近。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05"
          },
          {
            id: "bottle_base",
            label: "瓶座莲瓣",
            shape: "rect",
            rect: [0.24, 0.5, 0.76, 0.9],
            title: "瓶座莲瓣",
            body: "瓶座下部刻三层莲瓣纹。\n每层八瓣，瓣尖外卷。\n莲瓣纹雕刻深度达三分，远超砖雕注子的浮雕深度。",
            record: "瓶座下部刻三层莲瓣纹，每层八瓣，瓣尖外卷；雕刻深度达三分。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05"
          },
          {
            id: "return_front_west_from_bottle",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.9, 1, 1],
            title: "返回西壁",
            body: "高瓶细部已经记录。\n返回西壁后，案上器物与家具重新进入视线。",
            record: "完成高瓶近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "前室西壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_west_table_closeup: {
        id: "front_west_table_closeup",
        title: "砖砌桌近景",
        image: {
          src: "assets/M1/05_前室_西壁/第一号墓前室西壁壁画中砖砌桌及其侧面.png",
          alt: "砖砌桌近景",
          width: 684,
          height: 565
        },
        hotspots: [
          {
            id: "table_side",
            label: "桌侧线条",
            shape: "rect",
            rect: [0.18, 0.2, 0.86, 0.7],
            title: "桌侧线条",
            body: "桌的支柱和横木雕有凹入的线饰，桌上原敷彩色，现已脱落。",
            record: "桌的支柱和横木雕有凹入的线饰，桌上原敷彩色，现已脱落。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L11"
          },
          {
            id: "return_front_west_from_table",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.78, 1, 1],
            title: "返回西壁",
            body: "砖砌桌细部已经记录。\n返回西壁后，注子和高瓶重新进入视线。",
            record: "完成砖砌桌近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "前室西壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_east_shoes_closeup: {
        id: "front_east_shoes_closeup",
        title: "女乐尖鞋近景",
        image: {
          src: "assets/M1/04_前室_东壁/插图一七 第一号墓前室东壁壁画中女乐所着的尖鞋.png",
          alt: "女乐尖鞋近景",
          width: 1162,
          height: 1580
        },
        hotspots: [
          {
            id: "shoe_shape",
            label: "尖鞋形制",
            shape: "rect",
            rect: [0.18, 0.54, 0.82, 0.94],
            title: "尖鞋形制",
            body: "女乐尖鞋形制醒目。\n鞋尖轮廓突出。\n衣裙下缘与鞋面交界处仍可辨认。",
            record: "女乐尖鞋形制醒目，鞋尖轮廓突出。",
            sourceFile: "M1/04_前室_东壁/04_前室_东壁-增强线索表-v1.1.md",
            sourceClueId: "H06"
          },
          {
            id: "return_front_east_from_shoes",
            label: "返回东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0, 0.88, 1, 1],
            title: "返回东壁",
            body: "尖鞋细部已经记录。\n返回东壁后，人物与乐器重新进入视线。",
            record: "完成尖鞋近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "返回东壁",
              body: "东壁人物重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      front_west_ewer_closeup: {
        id: "front_west_ewer_closeup",
        title: "砖砌注子近景",
        image: {
          src: "assets/M1/05_前室_西壁/第一号墓前室西壁壁画中砖砌注子.png",
          alt: "砖砌注子近景",
          width: 684,
          height: 984
        },
        hotspots: [
          {
            id: "ewer_mouth",
            label: "注子流口",
            shape: "rect",
            rect: [0.48, 0.18, 0.82, 0.42],
            title: "注子流口",
            body: "砖雕注子实测高四寸。\n流口微翘，腹部圆鼓。\n该形制为北宋中期短流注子形制。",
            record: "注子实测高四寸，流口微翘，腹部圆鼓，为北宋中期短流注子形制。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05"
          },
          {
            id: "ewer_wall_joint",
            label: "注子形制",
            shape: "rect",
            rect: [0.2, 0.48, 0.72, 0.82],
            title: "注子形制",
            body: "注子位于桌上，旁设两盏及托子，着青色，注身上雕出瓜形弧线，注盖上雕有蹲兽为饰。",
            record: "注子位于桌上，旁设两盏及托子，着青色，注身上雕出瓜形弧线，注盖上雕有蹲兽为饰。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05"
          },
          {
            id: "return_front_west",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回西壁",
            body: "注子细部已经记录。\n返回西壁后，其他器物重新进入视线。",
            record: "完成注子近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "前室西壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      }
    }
  }
};

const addSceneView = (sceneId, viewId, view) => {
  const scene = SCENES[sceneId];
  if (!scene?.views) return;
  scene.views[viewId] = view;
};

const addSceneHotspot = (sceneId, viewId, hotspot) => {
  const view = SCENES[sceneId]?.views?.[viewId];
  if (!view) return;
  view.hotspots = [...(view.hotspots || []), hotspot];
};

Object.assign(POSITION_MAP.viewLabels, {
  environment_baisha_context: "墓外 / 白沙附近图",
  tomb_gate_structure_diagram: "墓门 / 结构复原图",
  corridor_gate_back_view: "甬道 / 回望墓门",
  front_east_lotus_crown_closeup: "前室 / 女乐莲花冠近景",
  rear_false_door_diagram: "后室 / 北壁假门结构图",
  rear_north_lower_closeup: "后室 / 北壁下部近景",
  rear_southeast: "后室 / 东南壁",
  rear_southeast_detail: "后室 / 东南壁细部",
  rear_land_deed_cover_closeup: "后室 / 地券并盖",
  rear_porcelain_bowl_closeup: "后室 / 白瓷碗",
  rear_bones_position_closeup: "后室 / 人骨葬具位置"
});

addSceneHotspot("environment", "environment_map", {
  id: "baisha_context_view",
  label: "白沙附近图",
  navLabel: "查看附近图",
  shape: "rect",
  rect: [0.04, 0.58, 0.34, 0.90],
  title: "白沙附近图",
  body: "白沙附近图可以把墓群位置继续放大到周边地貌中。\n它适合补充墓外环境，不进入墓室内部证据链。",
  record: "白沙附近图补充了墓群与周边地貌的关系，作为墓外环境观察。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓外环境线索精修版_v1.0.md",
  sourceClueId: "ENV-E-02",
  viewTransition: {
    targetViewId: "environment_baisha_context",
    title: "查看白沙附近图",
    body: "白沙附近图被单独打开。",
    closeLabel: "查看"
  }
});

addSceneView("environment", "environment_baisha_context", {
  id: "environment_baisha_context",
  title: "白沙附近图",
  image: {
    src: "assets/M1/01环境地图/白沙附近图.png",
    alt: "白沙附近图",
    width: 2304,
    height: 1728
  },
  hotspots: [
    {
      id: "baisha_area_relation",
      label: "附近地貌关系",
      shape: "rect",
      rect: [0.12, 0.14, 0.88, 0.78],
      title: "附近地貌关系",
      body: "这张图用于补足墓外环境的尺度。\n村落、墓群范围和进入第一号墓的方向可以在同一张图中观察。",
      record: "白沙附近图可用于标注村落、墓群范围和进入第一号墓的方向。",
      sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓外环境线索精修版_v1.0.md",
      sourceClueId: "ENV-E-02"
    },
    {
      id: "return_environment_map_from_baisha_context",
      label: "返回地形图",
      navLabel: "返回地形图",
      shape: "rect",
      rect: [0, 0.84, 1, 1],
      title: "返回地形图",
      body: "返回白沙宋墓地形图。",
      record: "返回白沙宋墓地形图。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "environment_map",
        title: "返回地形图",
        body: "视角回到白沙宋墓地形图。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneHotspot("tomb_gate", "tomb_gate_main", {
  id: "gate_structure_diagram_link",
  label: "墓门手稿图",
  navLabel: "墓门手稿图",
  shape: "rect",
  rect: [0.62, 0.12, 0.94, 0.42],
  title: "墓门手稿图",
  body: "一张墓门手稿图，从中清晰看出，墓门由门脊、十三陇瓯瓦、檐椽飞椽及单抄单昂五铺作等砖仿木构件构成。\n表面施以叠胜、柿蒂、卷草等彩画，其中铺作昂形制为批竹昂，与琴面昂并存，是出现最早的假昂实例。\n全部构件均为砖制。",
  record: "墓门由门脊、十三陇瓯瓦、檐椽飞椽及单抄单昂五铺作等砖仿木构件构成。表面施以叠胜、柿蒂、卷草等彩画。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
  sourceClueId: "GATE-P1-01",
  viewTransition: {
    targetViewId: "tomb_gate_structure_diagram",
    title: "墓门手稿图",
    body: "打开墓门手稿图。",
    closeLabel: "打开"
  }
});

addSceneView("tomb_gate", "tomb_gate_structure_diagram", {
  id: "tomb_gate_structure_diagram",
  title: "墓门复原及各部分名称图",
  image: {
    src: "assets/M1/02墓道与墓门/插图四 第一号墓墓门复原及墓门各部分名称图.png",
    alt: "第一号墓墓门复原及墓门各部分名称图",
    width: 4693,
    height: 3520
  },
  hotspots: [
    {
      id: "gate_parts_relation",
      label: "墓门各部分",
      shape: "rect",
      rect: [0.12, 0.12, 0.88, 0.78],
      title: "墓门各部分",
      body: "结构复原图适合做美工标注层：门额、门框、封门砖和门洞可以分别成为可视化标签。",
      record: "墓门复原图可作为门额、门框、封门砖和门洞的结构标注底图。",
      sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
      sourceClueId: "GATE-P1-01"
    },
    {
      id: "return_tomb_gate_from_structure_diagram",
      label: "返回墓门",
      navLabel: "返回墓门",
      shape: "rect",
      rect: [0, 0.84, 1, 1],
      title: "返回墓门",
      body: "返回墓门主视图。",
      record: "返回墓门主视图。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "tomb_gate_main",
        title: "返回墓门",
        body: "视角回到墓门主图。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("corridor", "corridor_gate_back_view", {
  id: "corridor_gate_back_view",
  title: "回望已打开的墓门",
  image: {
    src: "assets/M1/02墓道与墓门/Ⅱ 第一号墓墓门后部、甬道东壁.png",
    alt: "进入甬道后回望已打开的第一号墓墓门",
    width: 3520,
    height: 4693
  },
  hotspots: [
    {
      id: "gate_back_from_corridor",
      label: "回望墓门",
      shape: "rect",
      rect: [0.16, 0.10, 0.84, 0.80],
      title: "回望已打开的墓门",
      body: "你站在甬道里回望。赭色门扇已经打开，门框、门额背面和甬道墙面在同一视线里接合起来。",
      record: "进入甬道后回望，可见已打开墓门与甬道入口之间的空间关系。",
      sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
      sourceClueId: "GATE-P1-02"
    },
    {
      id: "return_corridor_from_gate_back",
      label: "继续甬道",
      navLabel: "继续甬道",
      shape: "rect",
      rect: [0.52, 0.84, 1, 1],
      title: "继续甬道",
      body: "视线从身后的墓门收回，继续观察甬道内部。",
      record: "回到甬道继续观察。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "corridor_overview",
        title: "继续甬道",
        body: "视角回到甬道总览。",
        closeLabel: "继续"
      }
    },
    {
      id: "step_back_tomb_gate_from_corridor",
      label: "退回墓门前",
      navLabel: "退回墓门",
      shape: "rect",
      rect: [0, 0.84, 0.48, 1],
      title: "退回墓门前",
      body: "你沿甬道退回已打开的墓门外侧，墓门正面仍可复查。",
      record: "从甬道退回墓门前复查。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      transition: {
        targetSceneId: "tomb_gate",
        targetViewId: "tomb_gate_main",
        unlocked: true,
        title: "退回墓门前",
        body: "你退回墓门前。\n门额、砖缝和墓门正面结构仍可继续复查。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneHotspot("corridor", "corridor_west_wall", {
  id: "west_wall_wine_bottle",
  label: "酒瓶细节",
  navLabel: "酒瓶",
  shape: "rect",
  rect: [0.18, 0.54, 0.52, 0.90],
  title: "甬道西壁酒瓶",
  body: "黑色高瓶，由“画上崔大郎酒”持瓶人双手捧持，疑似向墓主人进酒。\n该高瓶形制（小颈、环口、修腹）与文献中记载的“经瓶”或“酒京”相符，\n是当时河南、河北、山西、内蒙古一带民间使用的酒具，瓷胎者俗称梅瓶或花瓶，缸胎者俗称鸡腿坛。",
  record: "该高瓶小颈、环口、修腹,是当时北方民间盛行的盛酒具，瓷胎者俗称梅瓶或花瓶，缸胎者俗称鸡腿坛。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1甬道线索精修版_v1.0.md",
  sourceClueId: "COR-P1-02",
  detailImage: {
    src: "assets/M1/17_其他细节与特写/第一号墓甬道西壁壁画中的酒瓶.png",
    alt: "第一号墓甬道西壁壁画中的酒瓶",
    caption: "局部放大图"
  }
});

addSceneHotspot("front_chamber", "front_east", {
  id: "lotus_crown_detail",
  label: "莲花冠",
  navLabel: "莲花冠",
  shape: "rect",
  rect: [0.12, 0.12, 0.38, 0.42],
  title: "女乐莲花冠",
  body: "莲花冠是前室东壁女乐图像的服饰细节，可与排箫、尖鞋一起归入人物礼仪线索。",
  record: "女乐莲花冠可与排箫、尖鞋一起归入前室人物礼仪线索。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
  sourceClueId: "FRONT-P1-01",
  viewTransition: {
    targetViewId: "front_east_lotus_crown_closeup",
    title: "查看莲花冠",
    body: "女乐莲花冠近景被单独打开。",
    closeLabel: "查看"
  }
});

addSceneHotspot("front_chamber", "front_east", {
  id: "panpipe_detail",
  label: "排箫",
  navLabel: "排箫",
  shape: "rect",
  rect: [0.34, 0.20, 0.62, 0.58],
  title: "女乐排箫",
  body: "前排乐师所执。为十二管排箫，编管束在一起。\n两端同长，不同于汉唐时期一端较长、另一端较短的形制。排箫下端系有同心结饰。",
  record: "前排乐师所执。为十二管排箫，编管束在一起。\n两端同长，不同于汉唐时期一端较长、另一端较短的形制。排箫下端系有同心结饰。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
  sourceClueId: "FRONT-P1-01",
  detailImage: {
    src: "assets/M1/17_其他细节与特写/第一号墓前室东壁壁画中女乐所执的排箫.png",
    alt: "第一号墓前室东壁壁画中女乐所执的排箫",
    caption: "排箫局部放大图：排箫作为女乐音乐物象显示，可与服饰和仪仗细节对照。"
  }
});

addSceneHotspot("front_chamber", "front_south", {
  id: "mace_detail",
  label: "骨朵",
  navLabel: "骨朵",
  shape: "rect",
  rect: [0.42, 0.16, 0.62, 0.78],
  title: "前室南壁骨朵",
  body: "骨朵又称“杖”“瓜”、“蒜头”，\n是宋代上自帝王、下至士庶的仪仗常用器具，亦用作军器或刑具。",
  record: "骨朵又称“杖”“瓜”、“蒜头”，\n是宋代上自帝王、下至士庶的仪仗常用器具，亦用作军器或刑具。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
  sourceClueId: "FRONT-P1-02",
  detailImage: {
    src: "assets/M1/17_其他细节与特写/第一号墓前室南壁壁画中的骨朵.png",
    alt: "第一号墓前室南壁壁画中的骨朵",
    caption: "局部放大图"
  }
});

addSceneView("front_chamber", "front_east_lotus_crown_closeup", {
  id: "front_east_lotus_crown_closeup",
  title: "女乐莲花冠近景",
  image: {
    src: "assets/M1/17_其他细节与特写/第一号墓前室东壁壁画中女乐所戴的莲花冠.png",
    alt: "第一号墓前室东壁壁画中女乐所戴的莲花冠",
    width: 1940,
    height: 1563
  },
  hotspots: [
    {
      id: "lotus_crown_shape",
      label: "莲花冠形制",
      shape: "rect",
      rect: [0.14, 0.14, 0.86, 0.80],
      title: "莲花冠形制",
      body: "左侧女乐吹笙者所戴。冠体作莲花瓣形，冠下插簪饰。\n莲花冠始见于唐代，原为贵者所服，五代时蜀主王衍令后宫皆戴此冠，于是通行；宋代沿袭不衰。",
      record: "左侧女乐吹笙者所戴。冠体作莲花瓣形，冠下插簪饰。\n莲花冠始见于唐代，原为贵者所服，五代时蜀主王衍令后宫皆戴此冠，于是通行；宋代沿袭不衰。",
      sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
      sourceClueId: "FRONT-P1-01"
    },
    {
      id: "return_front_east_from_lotus_crown",
      label: "返回东壁",
      navLabel: "返回东壁",
      shape: "rect",
      rect: [0, 0.84, 1, 1],
      title: "返回前室东壁",
      body: "返回前室东壁。",
      record: "返回前室东壁。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "front_east",
        title: "返回东壁",
        body: "视角回到前室东壁。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneHotspot("rear_chamber", "rear_overview", {
  id: "rear_overview_turn_southeast",
  label: "转向东南壁",
  navLabel: "东南壁",
  shape: "rect",
  rect: [0.70, 0.68, 0.96, 0.86],
  title: "转向东南壁",
  body: "后室东南壁补足了后室多壁面关系，避免只围绕北壁和西北壁观察。",
  record: "后室东南壁补充了后室多壁面关系。",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
  sourceClueId: "HS-E-02",
  viewTransition: {
    targetViewId: "rear_southeast",
    title: "转向东南壁",
    body: "后室东南壁进入视线。",
    closeLabel: "转向"
  }
});

addSceneHotspot("rear_chamber", "rear_north", {
  id: "false_door_diagram_link",
  label: "假门结构图",
  navLabel: "假门结构",
  shape: "rect",
  rect: [0.24, 0.16, 0.76, 0.50],
  title: "北壁假门结构图",
  body: "假门结构图能把妇人启门从图像题材进一步放回北壁结构。",
  record: "北壁假门结构图用于把妇人启门放回假门结构中复查。",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
  sourceClueId: "HS-P0-04",
  viewTransition: {
    targetViewId: "rear_false_door_diagram",
    title: "查看假门结构图",
    body: "后室北壁假门结构图被单独打开。",
    closeLabel: "查看"
  }
});

addSceneHotspot("rear_chamber", "rear_north", {
  id: "rear_north_lower_link",
  label: "北壁下部",
  navLabel: "北壁下部",
  shape: "rect",
  rect: [0.16, 0.58, 0.84, 0.92],
  title: "后室北壁下部",
  body: "北壁下部可辅助对照假门、砖床与出土遗存的位置。",
  record: "后室北壁下部可辅助对照假门、砖床与出土遗存的位置。",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
  sourceClueId: "HS-E-01",
  viewTransition: {
    targetViewId: "rear_north_lower_closeup",
    title: "查看北壁下部",
    body: "后室北壁下部图被单独打开。",
    closeLabel: "查看"
  }
});

addSceneHotspot("rear_chamber", "rear_land_deed_closeup", {
  id: "land_deed_cover_link",
  label: "地券上盖",
  navLabel: "地券上盖",
  shape: "rect",
  rect: [0.62, 0.12, 0.92, 0.50],
  title: "地券上盖",
  body: "地券券盖出土时覆盖在地券上方，仅作顶盖遮挡",
  record: "地券券盖出土时覆盖在地券上方，仅作顶盖遮挡",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
  sourceClueId: "HS-P0-03",
  viewTransition: {
    targetViewId: "rear_land_deed_cover_closeup",
    title: "查看地券上盖",
    body: "近距离观察地券上盖",
    closeLabel: "查看"
  }
});

addSceneHotspot("rear_chamber", "rear_distribution_closeup", {
  id: "bones_position_link",
  label: "人骨位置",
  navLabel: "人骨位置",
  shape: "rect",
  rect: [0.10, 0.50, 0.50, 0.92],
  title: "人骨在葬具中的位置",
  body: "人骨位置图可以把散点遗存重新放回葬具范围里，不单靠近景判断。",
  record: "人骨在葬具中的位置图把遗存重新放回葬具范围中。",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
  sourceClueId: "HS-P0-02",
  viewTransition: {
    targetViewId: "rear_bones_position_closeup",
    title: "查看人骨位置",
    body: "人骨在葬具中的位置图被单独打开。",
    closeLabel: "查看"
  }
});

addSceneHotspot("rear_chamber", "rear_distribution_closeup", {
  id: "porcelain_bowl_link",
  label: "白瓷碗",
  navLabel: "白瓷碗",
  shape: "rect",
  rect: [0.54, 0.50, 0.92, 0.92],
  title: "砖床下白瓷碗",
  body: "白瓷碗是后室出土器物的补充细节，适合与地券、人骨位置一起构成葬具证据链。",
  record: "砖床下白瓷碗可与地券、人骨位置一起构成后室葬具证据链。",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
  sourceClueId: "HS-H-02",
  viewTransition: {
    targetViewId: "rear_porcelain_bowl_closeup",
    title: "查看白瓷碗",
    body: "砖床下白瓷碗图被单独打开。",
    closeLabel: "查看"
  }
});

addSceneView("rear_chamber", "rear_false_door_diagram", {
  id: "rear_false_door_diagram",
  title: "后室北壁假门结构图",
  image: {
    src: "assets/M1/10_后室_北壁/插图一三 第一号墓后室北壁假门.png",
    alt: "第一号墓后室北壁假门",
    width: 2233,
    height: 1877
  },
  hotspots: [
    {
      id: "false_door_lintel_frame",
      label: "门额与砖框",
      shape: "rect",
      rect: [0.12, 0.06, 0.77, 0.18],
      title: "门额与砖砌门框",
      body: "假门最上部的横枋，砖砌，与两侧榑柱相接。\n门额面雕砖作门簪四枚，外侧两枚，四瓣蒂形，较大；\n内侧两枚，圆形，较小。\n唐代至北宋中期多为正方形或扁方形门簪，北宋中期之后逐渐兴起圆形门簪。",
      record: "假门最上部的横枋，砖砌，与两侧榑柱相接。\n门额面雕砖作门簪四枚，外侧两枚，四瓣蒂形，较大；\n内侧两枚，圆形，较小。\n唐代至北宋中期多为正方形或扁方形门簪，北宋中期之后逐渐兴起圆形门簪。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "false_door_left_leaf",
      label: "左侧门扇",
      shape: "rect",
      rect: [0.25, 0.26, 0.44, 0.86],
      title: "左侧门扇纹样",
      body: "左扇向北微启，门扇上画蓝色门钉五排，排五钉。\n并各画蓝色门环一具。\n宋代有标准门钉制度，皇宫/官府门钉可多达九排九钉，民间则多为五排五钉。\n该墓符合北宋士庶之家的礼制规定。",
      record: "左扇向北微启，门扇上画蓝色门钉五排，排五钉。\n并各画蓝色门环一具。\n宋代有标准门钉制度，皇宫/官府门钉可多达九排九钉，民间则多为五排五钉。\n该墓符合北宋士庶之家的礼制规定。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05"
    },
    {
      id: "false_door_open_gap",
      label: "门缝暗部",
      shape: "rect",
      rect: [0.44, 0.25, 0.62, 0.86],
      title: "门缝暗部好像有东西.......",
      body: "左扇门打开后，自右侧露出一梳鬟饰着青衫的女子。",
      record: "左扇门打开后，自右侧露出一梳鬟饰着青衫的女子。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "false_door_open_leaf",
      label: "开启门扇",
      shape: "rect",
      rect: [0.61, 0.27, 0.72, 0.84],
      title: "开启状门扇",
      body: "右侧门扇呈开启状。\n门扇内侧与妇人位置相邻。",
      record: "右侧门扇呈开启状，门扇内侧与妇人位置相邻。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05",
      viewTransition: {
        targetViewId: "rear_woman_closeup",
        title: "查看妇人启门",
        body: "妇人启门近景被打开。",
        closeLabel: "查看"
      }
    },
    {
      id: "false_door_threshold",
      label: "门槛下沿",
      shape: "rect",
      rect: [0.19, 0.82, 0.68, 0.94],
      title: "门槛与下沿",
      body: "假门下沿位于门扇底部。\n下沿线条与北壁下部砖面相邻。",
      record: "假门下沿位于门扇底部，下沿线条与北壁下部砖面相邻。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "return_rear_north_from_false_door_diagram",
      label: "返回北壁",
      navLabel: "返回北壁",
      shape: "rect",
      rect: [0.02, 0.88, 0.18, 0.99],
      title: "返回后室北壁",
      body: "返回后室北壁。",
      record: "返回后室北壁。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_north",
        title: "返回北壁",
        body: "视角回到后室北壁。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("rear_chamber", "rear_north_lower_closeup", {
  id: "rear_north_lower_closeup",
  title: "后室北壁下部",
  image: {
    src: "assets/M1/10_后室_北壁/第一号墓后室北壁下部.png",
    alt: "第一号墓后室北壁下部",
    width: 1900,
    height: 1853
  },
  hotspots: [
    {
      id: "north_lower_lintel_blocks",
      label: "门额下部",
      shape: "rect",
      rect: [0.28, 0.18, 0.70, 0.33],
      title: "假门门额下部",
      body: "门额下部保留砖框、花饰和门洞上沿。\n这一处可以把北壁假门图像和下方砖床空间联系起来看。",
      record: "北壁下部门额保留砖框、花饰和门洞上沿，可连接假门图像与砖床空间。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-P0-05"
    },
    {
      id: "north_lower_open_door_leaf",
      label: "开启门扇",
      shape: "rect",
      rect: [0.28, 0.31, 0.45, 0.76],
      title: "开启门扇下部",
      body: "开启的门扇在下部近景中更清楚。\n它应和妇人启门、假门结构图一起复查，确认这是图像化的空间延续。",
      record: "开启门扇下部应与妇人启门和假门结构图一起复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05"
    },
    {
      id: "north_lower_woman_position",
      label: "妇人位置",
      shape: "rect",
      rect: [0.42, 0.34, 0.54, 0.77],
      title: "门缝中的妇人位置",
      body: "妇人位于两扇门之间。\n门缝和门框压住人物轮廓。",
      record: "妇人位于两扇门之间，门缝和门框压住人物轮廓。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05"
    },
    {
      id: "north_lower_closed_leaf",
      label: "右侧门扇",
      shape: "rect",
      rect: [0.49, 0.31, 0.70, 0.78],
      title: "右侧闭合门扇",
      body: "右侧门扇保持闭合。\n门扇线条与壁面线条相接。",
      record: "右侧门扇保持闭合，门扇线条与壁面线条相接。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "north_lower_threshold",
      label: "门槛下沿",
      shape: "rect",
      rect: [0.23, 0.72, 0.74, 0.86],
      title: "门槛下沿",
      body: "假门两扇版门的下沿直接坐落于地栿上，\n没有抬离地面的结构缝隙.",
      record: "假门两扇版门的下沿直接坐落于地栿上，\n没有抬离地面的结构缝隙.",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-P0-01"
    },
    {
      id: "north_lower_bed_boundary",
      label: "砖床边界",
      navLabel: "砖床边界",
      shape: "rect",
      rect: [0.20, 0.84, 0.82, 0.98],
      title: "砖床与下部边界",
      body: "画面下方可见砖面边界。\n北壁下部与砖床区域在此相接。",
      record: "画面下方可见砖面边界，北壁下部与砖床区域在此相接。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-01"
    },
    {
      id: "return_rear_north_from_lower",
      label: "返回北壁",
      navLabel: "返回北壁",
      shape: "rect",
      rect: [0.82, 0.86, 0.99, 0.99],
      title: "返回后室北壁",
      body: "返回后室北壁。",
      record: "返回后室北壁。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_north",
        title: "返回北壁",
        body: "视角回到后室北壁。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("rear_chamber", "rear_southeast", {
  id: "rear_southeast",
  title: "后室东南壁",
  image: {
    src: "assets/M1/12_后室_东壁与东南壁/第一号墓后室东南壁壁画.png",
    alt: "第一号墓后室东南壁壁画",
    width: 2057,
    height: 1525
  },
  hotspots: [
    {
      id: "rear_southeast_left_group",
      label: "左侧人物组",
      shape: "rect",
      rect: [0.10, 0.35, 0.34, 0.88],
      title: "东南壁左侧人物组",
      body: "左侧二女均高髻、戴白团冠、插簪饰，\n着窄袖蓝衫、云纹裙。\n前者坐椅上，面南与右侧男子交谈；\n后者站立，持铤形物.\n二人身后放置一件赭色衣架，架上搭有衣物；\n二女中间有一赭色高几，几面画有铤形和圆形物各一件.",
      record: "左侧二女均高髻、戴白团冠、插簪饰，\n着窄袖蓝衫、云纹裙。\n前者坐椅上，面南与右侧男子交谈；\n后者站立，持铤形物.\n二人身后放置一件赭色衣架，架上搭有衣物；\n二女中间有一赭色高几，几面画有铤形和圆形物各一件.",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_table_group",
      label: "桌案与器物",
      shape: "rect",
      rect: [0.30, 0.42, 0.57, 0.72],
      title: "桌案拜访了一些器物......",
      body: "赭色高几上摆放了一件铤形物和一件圆形物。\n铤形物疑似银铤，\n圆形物疑似金银饼或钱贯形状。",
      record: "赭色高几上摆放了一件铤形物和一件圆形物。\n铤形物疑似银铤，\n圆形物疑似金银饼或钱贯形状。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02",
      viewTransition: {
        targetViewId: "rear_southeast_detail",
        title: "查看东南壁细部",
        body: "仔细查看东南壁。",
        closeLabel: "查看"
      }
    },
    {
      id: "rear_southeast_right_bearer",
      label: "右侧承盘人物",
      shape: "rect",
      rect: [0.59, 0.30, 0.84, 0.86],
      title: "右侧承盘人物",
      body: "右侧二男头系皂巾，着圆领窄袖衫、白裤，\n左侧男性双手捧钱贯、右侧男性双手捧黑盘盛铤形和圆形物，\n面北侍立，作进奉状。\n此二男“似即甬道东壁和前室南壁所画之贡纳财物者”。",
      record: "右侧二男头系皂巾，着圆领窄袖衫、白裤，\n左侧男性双手捧钱贯、右侧男性双手捧黑盘盛铤形和圆形物，\n面北侍立，作进奉状。\n此二男“似即甬道东壁和前室南壁所画之贡纳财物者”。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_wall_edge",
      label: "砖砌悬幔",
      shape: "rect",
      rect: [0.82, 0.10, 0.98, 0.86],
      title: "砖砌悬幔",
      body: "悬幔是宋代墓室壁画中常见的室内空间分隔与装饰元素，\n是模拟死亡后“灵座”空间的必须陈设.\n悬幔下缘往往配有蓝色组绶。",
      record: "悬幔是宋代墓室壁画中常见的室内空间分隔与装饰元素，\n是模拟死亡后“灵座”空间的必须陈设.\n悬幔下缘往往配有蓝色组绶。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "return_rear_overview_from_southeast",
      label: "返回总览",
      navLabel: "返回总览",
      shape: "rect",
      rect: [0.02, 0.88, 0.18, 0.99],
      title: "返回后室入口总览",
      body: "返回后室入口总览。",
      record: "返回后室入口总览。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_overview",
        title: "返回总览",
        body: "视角回到后室入口总览。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("rear_chamber", "rear_southeast_detail", {
  id: "rear_southeast_detail",
  title: "后室东南壁细部",
  image: {
    src: "assets/M1/12_后室_东壁与东南壁/第一号墓后室东南壁壁画细部.png",
    alt: "第一号墓后室东南壁壁画细部",
    width: 2230,
    height: 1492
  },
  hotspots: [
    {
      id: "rear_southeast_detail_left_attendant",
      label: "左侧侍者",
      shape: "rect",
      rect: [0.02, 0.35, 0.22, 0.92],
      title: "左侧侍者",
      body: "细部图左侧人物位于桌案旁。\n人物衣纹和桌案边缘相邻。",
      record: "东南壁细部左侧人物位于桌案旁，人物衣纹和桌案边缘相邻。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_detail_table",
      label: "桌面器物",
      shape: "rect",
      rect: [0.20, 0.54, 0.55, 0.86],
      title: "桌面器物",
      body: "桌面器物处在人物之间。\n器物轮廓位于桌案上方。",
      record: "东南壁细部桌面器物处在人物之间，器物轮廓位于桌案上方。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_detail_middle_figure",
      label: "系皂巾男子",
      shape: "rect",
      rect: [0.55, 0.30, 0.72, 0.78],
      title: "系皂巾男子",
      body: "该男子系皂巾，着圆领窄袖衫，捧钱贯。\n皂巾是宋代庶人（平民、奴仆、侍从）的头巾式样，\n疑似是墓主人家的雇佣仆役而非亲属或士绅.",
      record: "该男子系皂巾，着圆领窄袖衫，捧钱贯。\n皂巾是宋代庶人（平民、奴仆、侍从）的头巾式样，\n疑似是墓主人家的雇佣仆役而非亲属或士绅.",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_detail_right_tray",
      label: "右侧男性承盘进贡",
      shape: "rect",
      rect: [0.70, 0.45, 0.98, 0.90],
      title: "右侧男性承盘进贡",
      body: "右侧男性面北侍立于左侧女性墓主人之前，作进奉状。\n双手所捧的容器盛放两端较宽厚、中间收窄的长方形物以及圆饼状物，\n方者疑似银铤，圆饼状疑似金饼或银饼。",
      record: "右侧男性面北侍立于左侧女性墓主人之前，作进奉状。\n双手所捧的容器盛放两端较宽厚、中间收窄的长方形物以及圆饼状物，\n方者疑似银铤，圆饼状疑似金饼或银饼。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "return_rear_southeast_from_detail",
      label: "返回东南壁",
      navLabel: "返回东南壁",
      shape: "rect",
      rect: [0.02, 0.88, 0.18, 0.99],
      title: "返回东南壁",
      body: "返回后室东南壁。",
      record: "返回后室东南壁。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_southeast",
        title: "返回东南壁",
        body: "视角回到后室东南壁。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("rear_chamber", "rear_land_deed_cover_closeup", {
  id: "rear_land_deed_cover_closeup",
  title: "地券并盖",
  image: {
    src: "assets/M1/16_出土器物与人骨/插图四七 第一号墓所出的地券并盖.png",
    alt: "第一号墓所出的地券并盖",
    width: 1934,
    height: 1742
  },
  hotspots: [
    {
      id: "land_deed_body_text_panel",
      label: "地券本体",
      shape: "rect",
      rect: [0.39, 0.24, 0.78, 0.70],
      title: "地券本体与朱书区",
      body: "中央砖面为地券本体。\n朱书文字区位于砖面中部。",
      record: "地券并盖图中的中央砖面为地券本体，朱书文字区位于砖面中部。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-04",
      viewTransition: {
        targetViewId: "rear_land_deed_closeup",
        title: "对照地券文字",
        body: "地券近景被打开。",
        closeLabel: "对照"
      }
    },
    {
      id: "return_rear_deed_from_cover",
      label: "返回地券",
      navLabel: "返回地券",
      shape: "rect",
      rect: [0.82, 0.86, 0.99, 0.99],
      title: "返回地券近景",
      body: "返回地券近景。",
      record: "返回地券近景。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_land_deed_closeup",
        title: "返回地券",
        body: "视角回到地券近景。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("rear_chamber", "rear_porcelain_bowl_closeup", {
  id: "rear_porcelain_bowl_closeup",
  title: "后室砖床下白瓷碗",
  image: {
    src: "assets/M1/16_出土器物与人骨/插图四八 第一号墓后室砖床下所出白瓷碗.png",
    alt: "第一号墓后室砖床下所出白瓷碗",
    width: 1789,
    height: 1336
  },
  hotspots: [
    {
      id: "porcelain_bowl_main_body",
      label: "碗体残片",
      shape: "rect",
      rect: [0.14, 0.24, 0.47, 0.62],
      title: "白瓷碗碗体残片",
      body: "白瓷碗主体残片位于画面左侧。\n器物呈破碎状态。",
      record: "白瓷碗主体残片位于画面左侧，器物呈破碎状态。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_rim_shards",
      label: "口沿残片",
      shape: "rect",
      rect: [0.35, 0.13, 0.66, 0.40],
      title: "口沿与上部残片",
      body: "上方残片保留口沿弧线。\n口沿边缘与主体残片分离。",
      record: "上方残片保留口沿弧线，口沿边缘与主体残片分离。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_lower_shards",
      label: "下部残片",
      shape: "rect",
      rect: [0.20, 0.58, 0.62, 0.90],
      title: "下部散落残片",
      body: "下部残片散落在主体下方。\n残片之间保留空隙。",
      record: "下部残片散落在主体下方，残片之间保留空隙。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_excavation_context",
      label: "出土背景",
      shape: "rect",
      rect: [0.56, 0.25, 0.98, 0.84],
      title: "出土背景与残留痕迹",
      body: "右侧背景保留出土记录图版中的暗色区域。\n暗色区域与器物残片相邻。",
      record: "右侧背景保留出土记录图版中的暗色区域，暗色区域与器物残片相邻。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "return_rear_distribution_from_bowl",
      label: "返回分布图",
      navLabel: "返回分布图",
      shape: "rect",
      rect: [0.80, 0.86, 0.99, 0.99],
      title: "返回出土物分布图",
      body: "返回出土物分布图。",
      record: "返回出土物分布图。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_distribution_closeup",
        title: "返回分布图",
        body: "视角回到出土物分布图。",
        closeLabel: "返回"
      }
    }
  ]
});

addSceneView("rear_chamber", "rear_bones_position_closeup", {
  id: "rear_bones_position_closeup",
  title: "人骨在葬具中的位置",
  image: {
    src: "assets/M1/16_出土器物与人骨/第一号墓人骨在葬具中的位置.png",
    alt: "第一号墓人骨在葬具中的位置",
    width: 1036,
    height: 989
  },
  hotspots: [
    {
      id: "bones_position_burial_range",
      label: "葬具范围",
      shape: "rect",
      rect: [0.06, 0.06, 0.93, 0.78],
      title: "葬具范围与位置标记",
      body: "图中标记显示人骨位于葬具范围内。\n标记线与骨骼分布相互叠合。",
      record: "图中标记显示人骨位于葬具范围内，标记线与骨骼分布相互叠合。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-02"
    },
    {
      id: "bones_position_skull_end",
      label: "头骨端",
      shape: "rect",
      rect: [0.08, 0.10, 0.27, 0.34],
      title: "头骨端",
      body: "头骨端位于图像左上区域。\n头骨端与肢骨集中区之间保留距离。",
      record: "头骨端位于图像左上区域，与肢骨集中区之间保留距离。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-02"
    },
    {
      id: "bones_position_limb_cluster",
      label: "肢骨集中区",
      shape: "rect",
      rect: [0.28, 0.17, 0.77, 0.48],
      title: "肢骨集中区",
      body: "肢骨集中区位于图像中上部。\n骨骼集中在标记范围内。",
      record: "肢骨集中区位于图像中上部，骨骼集中在标记范围内。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-02"
    },
    {
      id: "bones_position_trace_left",
      label: "左下痕迹区",
      shape: "rect",
      rect: [0.07, 0.50, 0.31, 0.72],
      title: "左下葬具痕迹",
      body: "左下方可见残留痕迹。\n该区域位于人骨集中区下方。",
      record: "左下方可见残留痕迹，该区域位于人骨集中区下方。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-03"
    },
    {
      id: "bones_position_trace_right",
      label: "右下痕迹区",
      shape: "rect",
      rect: [0.68, 0.52, 0.94, 0.72],
      title: "右下葬具痕迹",
      body: "右下方可见残留痕迹。\n该区域位于人骨集中区右下侧。",
      record: "右下方可见残留痕迹，该区域位于人骨集中区右下侧。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-03"
    },
    {
      id: "return_rear_distribution_from_bones_position",
      label: "返回分布图",
      navLabel: "返回分布图",
      shape: "rect",
      rect: [0.78, 0.86, 0.99, 0.99],
      title: "返回出土物分布图",
      body: "返回出土物分布图。",
      record: "返回出土物分布图。",
      sourceFile: "game-navigation",
      sourceClueId: "NAV",
      viewTransition: {
        targetViewId: "rear_distribution_closeup",
        title: "返回分布图",
        body: "视角回到出土物分布图。",
        closeLabel: "返回"
      }
    }
  ]
});

const CONCLUSION_DATA = {
  cards: [
    {
      id: "tomb_gate",
      sceneId: "tomb_gate",
      chapter: "墓门",
      title: "墓门结论卡",
      summary: "墓门不只是通向墓室的入口，它本身已经保留了结构重组的证据。",
      conclusion: "门额背面彩画与封门砖缝差异共同说明，墓门既是入口，也是第一道证据界面。",
      generationPrompt: {
        title: "新结论卡已生成：墓门",
        body: "门额背面与封门砖缝已经能组成第一组结构证据。现在可以在线索墙里查看墓门的阶段性判断。 "
      },
      completionSummary: {
        title: "墓门阶段完成",
        body: "你已经把墓门从单纯入口，整理成可讨论的证据界面。下一步应进入甬道，继续确认通道与顶部的关系。 "
      },
      requirements: [
        {
          id: "analysis:tomb_gate:review_surface_compare",
          label: "门额前后层次复查",
          metText: "门额前后层次已经复查，可确认题字与背面彩画不处在同一处理层。",
          missingText: "还缺门额前后层次复查。先把正面题字和背面彩画拉到同一组里，再判断墓门是否经历过不同处理。 "
        },
        {
          id: "analysis:tomb_gate:review_sealing_structure",
          label: "封门方式复查",
          metText: "封门方式已经完成合看核对，石英砂灰缝已被降级为补充细节。",
          missingText: "还缺封门方式复查。需要先把砖缝与地面交界一起复看，才知道哪些异常只是砌筑痕迹。 "
        },
        {
          id: "analysis:tomb_gate:combo",
          label: "墓门组合判断",
          metText: "墓门章节已经完成观察、分类、证据组合和存疑降级，可进入主线结论。",
          missingText: "还缺墓门组合判断。单条观察尚未生成结论卡，需先在整理台完成分类与证据组合。 "
        }
      ],
      relations: ["R01", "R02", "R08"]
    },
    {
      id: "corridor",
      sceneId: "corridor",
      chapter: "甬道",
      title: "甬道结论卡",
      summary: "甬道承担过渡功能，顶部彩画与两壁画面一起把空间压向前室。",
      conclusion: "甬道顶部错位和两壁方向性共同说明，这里承担的是过渡与引导，而不是静态陈设。",
      generationPrompt: {
        title: "新结论卡已生成：甬道",
        body: "甬道顶部错位已经和通道方向结合起来，形成第二张阶段性结论卡。现在可以在线索墙查看甬道如何承接前室。 "
      },
      completionSummary: {
        title: "甬道阶段完成",
        body: "甬道的作用已经不再只是通行。你已经记录了顶部和彩画重整痕迹，接下来应进入前室，看完整礼仪空间如何展开。 "
      },
      requirements: [
        {
          id: "analysis:corridor:review_roof_alignment",
          label: "顶部错位复查",
          metText: "甬道顶部错位已经复查，可确认偏移与刮改同属一条证据链。",
          missingText: "还缺顶部错位复查。需要先把顶部整体、叠胜彩画和起拱边线放在同一组里判断。 "
        },
        {
          id: "analysis:corridor:review_direction",
          label: "通道导向复查",
          metText: "甬道两壁和中段方向已经复查，可确认甬道承担引导与过渡功能。",
          missingText: "还缺通道导向复查。甬道还需要中段和两壁方向。 "
        },
        {
          id: "analysis:corridor:combo",
          label: "甬道组合判断",
          metText: "甬道章节已经完成观察、分类和证据组合，可进入主线结论。",
          missingText: "还缺甬道组合判断。当前仍是单条观察，需先在整理台完成分类与证据组合。 "
        }
      ],
      relations: ["R01", "R03", "R08"]
    },
    {
      id: "front_chamber",
      sceneId: "front_chamber",
      chapter: "前室",
      title: "前室结论卡",
      summary: "前室的器物、人物、壁函和顶部结构已经能拼成礼仪空间，而不是分散图像。",
      conclusion: "前室是礼仪展示空间，内部同时保留了年代错层和局部重绘的线索。",
      generationPrompt: {
        title: "新结论卡已生成：前室",
        body: "前室的器物线、人物线与壁函、顶部结构已经能互相对照。现在可以在线索墙查看前室的礼仪空间判断。 "
      },
      completionSummary: {
        title: "前室阶段完成",
        body: "你已经把前室从多面壁画整理成礼仪空间。接下来应进入过道，确认文字与结构如何把时间信息压进通道。 "
      },
      requirements: [
        {
          id: "analysis:front_chamber:review_artifact_tension",
          label: "器物年代与重绘复查",
          metText: "器物年代与重绘复查已完成，可确认西壁器物并非同一时间层的简单陈列。",
          missingText: "还缺器物年代与重绘复查。需要把注子、高瓶和砖砌桌一起复看。 "
        },
        {
          id: "analysis:front_chamber:review_ritual_sequence",
          label: "礼仪动线复查",
          metText: "礼仪动线复查已完成，可把东壁人物、南壁入口和北壁过渡放进同一条序列。",
          missingText: "还缺礼仪动线复查。前室还需要人物与空间引导。 "
        },
        {
          id: "analysis:front_chamber:review_partition_structure",
          label: "入口分区与顶部结构复查",
          metText: "入口分区与顶部结构复查已完成，可确认前室不是平铺画面，而是被明确分区的礼仪空间。",
          missingText: "还缺入口分区与顶部结构复查。需要把南壁壁函、倚柱与顶部铺作一起复看。 "
        },
        {
          excludedId: "front_chamber:pointed_shoes",
          label: "尖鞋存疑已降级",
          metText: "尖鞋已被降级，单一服饰细节不会再直接支撑前室主线。",
          missingText: "还缺尖鞋存疑降级。单独鞋型先记录为服饰细节。 "
        },
        {
          excludedId: "front_chamber:east_wall_surface",
          label: "东壁温差存疑已降级",
          metText: "东壁温差已被降级，单次手电照射下的体感差异不会直接进入主线判断。",
          missingText: "还缺东壁温差存疑降级。手电照射后的局部差异先记录为体感异常。 "
        },
        {
          id: "analysis:front_chamber:combo",
          label: "前室组合判断",
          metText: "前室章节已经完成观察、复查、降级与组合，可进入主线结论。",
          missingText: "还缺前室组合判断。当前仍是分散观察，需先完成复查并降级存疑线索。 "
        }
      ],
      relations: ["R01", "R04", "R08"]
    },
    {
      id: "passage",
      sceneId: "passage",
      chapter: "过道",
      title: "过道结论卡",
      summary: "过道把题记、棂窗和宝盖压在同一条转场动线上，时间与空间信息在此交汇。",
      conclusion: "过道是时间信息和空间转换的交汇点，文字与结构都在这里变得可疑。",
      generationPrompt: {
        title: "新结论卡已生成：过道",
        body: "题记、棂窗和宝盖已经能在同一条通道里互相解释。现在可以在线索墙查看过道如何把时间信息压进空间。 "
      },
      completionSummary: {
        title: "过道阶段完成",
        body: "过道已经从单条窄路变成时间与结构并置的节点。下一步应进入后室，验证这些异常最终如何在核心空间收束。 "
      },
      requirements: [
        {
          id: "analysis:passage:review_inscription_layer",
          label: "题记层次复查",
          metText: "题记层次已经复查，可确认文字与壁画色层并非简单同层。",
          missingText: "还缺题记层次复查。需要先把题记整体、文字和下沿一起复看。 "
        },
        {
          id: "analysis:passage:review_spatial_structure",
          label: "窗棂与宝盖复查",
          metText: "窗棂和宝盖已经复查，可确认过道同时承担展开与收束两种空间作用。",
          missingText: "还缺窗棂与宝盖复查。过道还需要棂窗和顶部结构。 "
        },
        {
          id: "analysis:passage:combo",
          label: "过道组合判断",
          metText: "过道章节已经完成观察、分类和证据组合，可进入主线结论。",
          missingText: "还缺过道组合判断。需先在整理台完成分类和证据组合，结论卡才会生成。 "
        }
      ],
      relations: ["R01", "R05", "R08"]
    },
    {
      id: "rear_chamber",
      sceneId: "rear_chamber",
      chapter: "后室",
      title: "后室结论卡",
      summary: "后室把假门图像、地券文书和砖床遗存压进同一条证据链，确认图像与遗存如何互相解释。",
      conclusion: "后室核心不是单条奇异细节，而是假门图像、地券和砖床遗存共同指向一组需要谨慎辨别的葬仪与身份证据。",
      generationPrompt: {
        title: "新结论卡已生成：后室",
        body: "后室图像、文书和遗存已经可以并读。现在可以在线索墙查看后室如何形成核心判断。 "
      },
      completionSummary: {
        title: "后室阶段完成",
        body: "后室已经完成从假门到砖床遗存的收束。下一步可以进入终章，或继续复看后室日常器物线。 "
      },
      requirements: [
        {
          id: "analysis:rear_chamber:review_false_door_structure",
          label: "假门图像复查",
          metText: "假门图像复查已完成，可确认妇人启门不是孤立人物，而是与门缝结构一起形成的图像判断。",
          missingText: "还缺假门图像复查。需要把北壁整体、妇人启门和门缝槽口一起复看。 "
        },
        {
          id: "analysis:rear_chamber:review_document_layer",
          label: "地券文书复查",
          metText: "地券文书复查已完成，可确认券文层次与书写结构都足以进入主链。",
          missingText: "还缺地券文书复查。需要把地券整体、券文与行列关系一起复看。 "
        },
        {
          id: "analysis:rear_chamber:review_burial_distribution",
          label: "葬具证据链复查",
          metText: "葬具证据链复查已完成，可把砖床、人骨、铁钉和地券压进同一组判断。",
          missingText: "还缺葬具证据链复查。需要把砖床边界、人骨范围、铁钉角点和地券文书一起复看。 "
        },
        {
          excludedId: "rear_chamber:woman_hand",
          label: "妇人手部新断口已降级",
          metText: "妇人手部新断口已被降级，不再直接推动后室主线。",
          missingText: "还缺妇人手部新断口降级。单一点位的新旧差异先记录为局部残损。 "
        },
        {
          excludedId: "rear_chamber:nail_count",
          label: "铁钉数量异常已降级",
          metText: "铁钉数量异常已被降级，单点数量差不会替代整体分布关系。",
          missingText: "还缺铁钉数量异常降级。单独角点数量差先记录为角点细节。 "
        },
        {
          id: "analysis:rear_chamber:combo",
          label: "后室组合判断",
          metText: "后室已经完成观察、复查、降级与组合，可进入主线结论。",
          missingText: "还缺后室组合判断。当前仍是分散观察，需先完成复查并降级存疑线索。 "
        }
      ],
      relations: ["R01", "R06", "R07", "R08"]
    },
    {
      id: "final_report",
      chapter: "终章",
      title: "终章汇总结论卡",
      summary: "终章把各章节已经成立的判断收束成一条可供继续研究的主线。",
      conclusion: "M1 的意义并不来自单条异象，而来自墓门、甬道、前室、过道与后室多层证据的共同指向。",
      generationPrompt: {
        title: "新结论卡已生成：终章",
        body: "五个章节的阶段性结论已经可以并入终章。现在可以在线索墙查看这些判断如何汇成一条主线。 "
      },
      completionSummary: {
        title: "终章已可汇总",
        body: "主干证据已经足以形成阶段性研究判断。接下来应继续补强证据复查，而不是盲目增加散点热区。 "
      },
      unlockRequirements: [
        {
          sceneId: "tomb_gate",
          completed: true,
          label: "完成墓门章节",
          missingText: "墓门章节尚未完成，终章还缺第一道结构证据界面。 "
        },
        {
          sceneId: "corridor",
          completed: true,
          label: "完成甬道章节",
          missingText: "甬道章节尚未完成，终章还缺通道与顶部的过渡线。 "
        },
        {
          sceneId: "front_chamber",
          completed: true,
          label: "完成前室章节",
          missingText: "前室章节尚未完成，终章还缺礼仪空间与年代错层线。 "
        },
        {
          sceneId: "passage",
          completed: true,
          label: "完成过道章节",
          missingText: "过道章节尚未完成，终章还缺题记与结构交汇线。 "
        },
        {
          sceneId: "rear_chamber",
          completed: true,
          label: "完成后室章节",
          missingText: "后室章节尚未完成，终章还缺遗存、图像与日常器物的收束。 "
        }
      ],
      relations: ["R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09"]
    }
  ],
  relations: [
    {
      id: "R01",
      title: "空间序列链",
      summary: "把墓门、甬道、前室、过道和后室按进入顺序合读，形成 M1 从入口到安葬核心的连续空间序列。",
      requirements: [
        { sceneId: "tomb_gate", completed: true, label: "墓门" },
        { sceneId: "corridor", completed: true, label: "甬道" },
        { sceneId: "front_chamber", completed: true, label: "前室" },
        { sceneId: "passage", completed: true, label: "过道" },
        { sceneId: "rear_chamber", completed: true, label: "后室" }
      ]
    },
    {
      id: "R02",
      title: "墓门结构链",
      summary: "门额正背、封门砖与灰缝复查共同说明，墓门既是入口，也是第一道结构与装饰证据界面。",
      requirements: [
        { id: "analysis:tomb_gate:review_surface_compare", label: "门额前后层次复查" },
        { id: "analysis:tomb_gate:review_sealing_structure", label: "封门方式复查" },
        { excludedId: "tomb_gate:brick_seam", label: "砖缝单点异常已降级" },
        { id: "analysis:tomb_gate:combo", label: "墓门章节判断" }
      ]
    },
    {
      id: "R03",
      title: "甬道三面合读链",
      summary: "顶部、东壁和西壁共同建立通道秩序，甬道承担墓门到前室之间的过渡与引导。",
      requirements: [
        { id: "analysis:corridor:review_roof_alignment", label: "顶部错位复查" },
        { id: "analysis:corridor:review_direction", label: "通道导向复查" },
        { id: "analysis:corridor:combo", label: "甬道章节判断" }
      ]
    },
    {
      id: "R04",
      title: "前室礼仪展示链",
      summary: "人物、器物、入口秩序、北壁过渡与顶部结构共同说明，前室是被组织过的礼仪展示空间。",
      requirements: [
        { id: "analysis:front_chamber:review_artifact_tension", label: "器物组合复查" },
        { id: "analysis:front_chamber:review_ritual_sequence", label: "礼仪动线复查" },
        { id: "analysis:front_chamber:review_partition_structure", label: "入口分区与顶部结构复查" },
        { id: "analysis:front_chamber:combo", label: "前室章节判断" }
      ]
    },
    {
      id: "R05",
      title: "过道时间转换链",
      summary: "纪年题记、破子棂窗和顶部宝盖合读，说明过道集中承载时间锚点与前后室转换信息。",
      requirements: [
        { id: "analysis:passage:review_inscription_layer", label: "题记层次复查" },
        { id: "analysis:passage:review_spatial_structure", label: "窗棂与宝盖复查" },
        { id: "analysis:passage:combo", label: "过道章节判断" }
      ]
    },
    {
      id: "R06",
      title: "后室安葬遗存链",
      summary: "假门图像、地券文书、砖床、人骨和铁钉共同回到后室安葬核心区，而不是由单点异常独立解释。",
      requirements: [
        { id: "analysis:rear_chamber:review_false_door_structure", label: "假门图像复查" },
        { id: "analysis:rear_chamber:review_document_layer", label: "地券文书复查" },
        { id: "analysis:rear_chamber:review_burial_distribution", label: "葬具证据链复查" },
        { id: "analysis:rear_chamber:combo", label: "后室章节判断" }
      ]
    },
    {
      id: "R07",
      title: "后室地下寝居链",
      summary: "后室南壁、西南壁、东北/西北壁和顶部器物图像共同补充地下寝居与日常陈设的图像空间。",
      requirements: [
        { anyOf: ["rear_chamber:rear_south_back_entrance", "rear_chamber:rear_south_high_table"], label: "南壁入口背面与高几" },
        { anyOf: ["rear_chamber:rear_southwest_mirror_stand", "rear_chamber:rear_southwest_basin_stand"], label: "西南壁日用器物" },
        { anyOf: ["rear_chamber:rear_northeast_lamp", "rear_chamber:rear_northwest_scissors_iron"], label: "东北/西北壁日用器物" },
        { anyOf: ["rear_chamber:rear_ceiling_intermediate_bracket", "rear_chamber:rear_ceiling_small_bracket"], label: "后室顶部结构" }
      ]
    },
    {
      id: "R08",
      title: "存疑降级链",
      summary: "把容易被误读的单点异常放回复查和降级流程，避免它们串成超出材料的解释。",
      requirements: [
        { excludedId: "tomb_gate:brick_seam", label: "砖缝单点异常已降级" },
        { excludedId: "front_chamber:pointed_shoes", label: "尖鞋细节已降级" },
        { excludedId: "front_chamber:east_wall_surface", label: "东壁体感异常已降级" },
        { excludedId: "rear_chamber:woman_hand", label: "妇人手部断口已降级" },
        { excludedId: "rear_chamber:nail_count", label: "铁钉数量差异已降级" }
      ]
    },
    {
      id: "R09",
      title: "终章三栏报告",
      summary: "终章把已完成的章节判断分成可判断、可推测和仍存疑三类，形成总线索。",
      requirements: [
        { relationId: "R01", label: "空间序列链" },
        { relationId: "R02", label: "墓门结构链" },
        { relationId: "R03", label: "甬道三面合读链" },
        { relationId: "R04", label: "前室礼仪展示链" },
        { relationId: "R05", label: "过道时间转换链" },
        { relationId: "R06", label: "后室安葬遗存链" },
        { relationId: "R08", label: "存疑降级链" }
      ]
    }
  ],
  finalSynthesis: {
    title: "终章总线索",
    summary: "章节结论卡会按空间顺序进入总线索。终章不新增奇异点，而是把已完成判断收束成阶段性研究报告。",
    chapterOrder: ["tomb_gate", "corridor", "front_chamber", "passage", "rear_chamber"],
    lanes: [
      {
        id: "space_sequence",
        title: "空间顺序",
        summary: "从墓门、甬道、前室、过道到后室，形成由入口进入安葬核心的连续序列。",
        cardIds: ["tomb_gate", "corridor", "front_chamber", "passage", "rear_chamber"]
      },
      {
        id: "structure_transition",
        title: "结构与过渡",
        summary: "墓门、甬道、过道和后室假门共同说明，砖室空间通过结构图像层层转换。",
        cardIds: ["tomb_gate", "corridor", "passage", "rear_chamber"]
      },
      {
        id: "image_function",
        title: "图像功能",
        summary: "前室礼仪展示与后室地下寝居图像形成对照，说明图像不是单纯装饰。",
        cardIds: ["front_chamber", "rear_chamber"]
      },
      {
        id: "document_relic",
        title: "文书与遗存",
        summary: "过道题记、后室地券、人骨和铁钉共同构成时间、文书和安葬遗存的主证。",
        cardIds: ["passage", "rear_chamber"]
      },
      {
        id: "caution_boundary",
        title: "存疑边界",
        summary: "尖鞋、手部断口、铁钉数量差异等单点观察需要经过降级，不能替代章节判断。",
        cardIds: ["tomb_gate", "front_chamber", "rear_chamber"]
      }
    ],
    chapterContributions: {
      tomb_gate: ["space_sequence", "structure_transition", "caution_boundary"],
      corridor: ["space_sequence", "structure_transition"],
      front_chamber: ["space_sequence", "image_function", "caution_boundary"],
      passage: ["space_sequence", "structure_transition", "document_relic"],
      rear_chamber: ["space_sequence", "structure_transition", "image_function", "document_relic", "caution_boundary"]
    }
  }
};

const NPC_DATA = {
  opening: [
    {
      id: "opening_prologue",
      kicker: "墓外开场",
      speaker: "林砚秋",
      title: "到白沙",
      body: "林砚秋抵达白沙时，随身的银扣还压在记录本里。它暂时不是证据，只是一条私人线索，提醒她先把眼前的墓放回真实地面。"
    },
    {
      id: "opening_task",
      kicker: "调查说明",
      speaker: "粟柏年",
      title: "本轮记录规则",
      body: "搜集材料后先完成必要小游戏，再回到记录夹做线索分类、证据组合和存疑降级。章节剧情会在判断成立后推进下一关。"
    },
    {
      id: "opening_method",
      kicker: "调查说明",
      speaker: "陈怀远",
      title: "先看大局",
      body: "墓不是从墓门才开始的。先看地形、入口和墓室轴线，再决定每一处证据该放在哪个位置。"
    }
  ],
  sceneEntries: {
    environment: [
      {
        id: "entry_environment",
        kicker: "章节入口",
        speaker: "陈怀远",
        title: "墓外不是空白",
        body: "先不要急着进墓门。地形、平剖面和墓门外围会告诉你，M1 是一条从外到内逐步收紧的空间序列。"
      }
    ],
    tomb_gate: [
      {
        id: "entry_tomb_gate",
        kicker: "章节入口",
        speaker: "考古技工",
        title: "墓门先看结构",
        body: "墓道口在土岗东坡，门额、封门砖、门前地面和门洞不能分开看。先清理入口，再判断哪些线索能进入主链。"
      }
    ],
    corridor: [
      {
        id: "entry_corridor",
        kicker: "章节入口",
        speaker: "陈怀远",
        title: "甬道要三面合读",
        body: "别只往前走。抬头看顶部，再侧看两壁：顶部压低、纹样错位、两壁朝向共同决定这段通道怎样把人推向前室。"
      }
    ],
    front_chamber: [
      {
        id: "entry_front_chamber",
        kicker: "章节入口",
        speaker: "考古队员",
        title: "前室先总览",
        body: "穿过甬道后，空间一下展开。先把入口、四壁和顶部放在同一张复查表里，再判断女乐、器物和分区之间的关系。"
      }
    ],
    passage: [
      {
        id: "entry_passage",
        kicker: "章节入口",
        speaker: "陈怀远",
        title: "过道是转换点",
        body: "空间忽然窄下来，题记、棂窗和宝盖都挤在这里。不要让题记单独下结论，它必须和过道结构一起读。"
      }
    ],
    rear_chamber: [
      {
        id: "entry_rear_chamber",
        kicker: "章节入口",
        speaker: "考古队员",
        title: "后室先定基准",
        body: "进入后室后，先建立北壁假门、砖床、人骨、铁钉、地券和日常器物的编号关系。这里的信息最多，也最容易被单点误导。"
      }
    ]
  },
  clueReactions: {
    "environment:m1_sequence_map": {
      id: "clue_env_sequence",
      kicker: "线索提示",
      speaker: "陈怀远",
      title: "六段空间先成立",
      body: "墓道、墓门、甬道、前室、过道、后室先连成一条线。后面的每条证据，都要回到这条线里定位。"
    },
    "environment:six_part_sequence": {
      id: "clue_env_six_parts",
      kicker: "线索提示",
      speaker: "记录员",
      title: "轴线已经建立",
      body: "平剖面可以作为后续判断的底图。先记住：空间顺序是证据排序，不只是导航路线。"
    },
    "tomb_gate:lintel_back": {
      id: "clue_gate_lintel_back",
      kicker: "关键线索",
      speaker: "陈怀远",
      title: "门额背面也有信息",
      body: "正面是题字，背面是卷草。墓门不是只有正面可读，前后两层要一起复查。"
    },
    "tomb_gate:brick_seam": {
      id: "clue_gate_brick_seam",
      kicker: "存疑线索",
      speaker: "考古领队",
      title: "别急着放大石英砂",
      body: "石英砂很醒目，但它现在只是灰缝里的单点异常。等你和门前地面合看后，再决定它是主证还是砌筑细节。"
    },
    "tomb_gate:threshold": {
      id: "clue_gate_threshold",
      kicker: "线索提示",
      speaker: "考古技工",
      title: "门前地面是封门边界",
      body: "门前地面能把封门砖下缘和墓道关系接起来。墓门章节的判断要靠这个边界收住。"
    },
    "tomb_gate:door_opening": {
      id: "clue_gate_door_opening",
      kicker: "线索提示",
      speaker: "陈怀远",
      title: "进入前先清理",
      body: "门洞深处还不能直接穿过去。把浮土和碎砖清开，入口结构才会显出来。"
    },
    "corridor:corridor_roof": {
      id: "clue_corridor_roof",
      kicker: "关键线索",
      speaker: "陈怀远",
      title: "顶部先露出问题",
      body: "这段甬道低，顶部离视线很近。叠胜纹的错位不是装饰细节，它会牵出后面的重绘判断。"
    },
    "corridor:overlapping_pattern": {
      id: "clue_corridor_pattern",
      kicker: "关键线索",
      speaker: "考古队员",
      title: "叠胜纹要拼回中线",
      body: "偏移、刀刮痕和色层变化要放在一起。等残片拼合完成，才能判断这是偶然破损还是人为调整。"
    },
    "corridor:east_wall_direction": {
      id: "clue_corridor_east_wall",
      kicker: "线索提示",
      speaker: "记录员",
      title: "东壁给出方向",
      body: "人物和器物的朝向把视线推向墓室深处。甬道不只是通行，它在引导观看。"
    },
    "corridor:west_wall_inscription": {
      id: "clue_corridor_west_wall",
      kicker: "线索提示",
      speaker: "记录员",
      title: "两壁需要对照",
      body: "西壁题字区的高度和留白，可以和东壁朝向互相校验。甬道判断要从顶部扩展到两壁。"
    },
    "front_chamber:female_musicians": {
      id: "clue_front_musicians",
      kicker: "关键线索",
      speaker: "陈怀远",
      title: "女乐不是孤立画面",
      body: "莲花冠、排箫、仪仗和通行方向要一起看。前室的重点不是漂亮图像，而是礼仪动线。"
    },
    "front_chamber:brick_table": {
      id: "clue_front_table",
      kicker: "线索提示",
      speaker: "考古队员",
      title: "器物线有时间张力",
      body: "砖砌桌、注子和高瓶的尺度逻辑并不完全一致。把器物合看，才能判断是否存在重绘或替换表达。"
    },
    "front_chamber:south_wall_overview": {
      id: "clue_front_south",
      kicker: "关键线索",
      speaker: "记录员",
      title: "入口被主动分区",
      body: "南壁两侧壁函和倚柱不是平均展开。前室的空间组织，要从入口分区和顶部结构一起确认。"
    },
    "front_chamber:north_west_mural": {
      id: "clue_front_north_west",
      kicker: "线索提示",
      speaker: "陈怀远",
      title: "北壁开始指向下一段",
      body: "北壁西部画面更密，靠近通向内侧的方向。前室收束时要解释为什么画面会在这里加重。"
    },
    "front_chamber:north_east_mural": {
      id: "clue_front_north_east",
      kicker: "线索提示",
      speaker: "记录员",
      title: "东西两段要并读",
      body: "北壁东部留白更多，和西部密集画面形成差异。不要把它们拆成两条无关记录。"
    },
    "passage:inscription": {
      id: "clue_passage_inscription",
      kicker: "关键线索",
      speaker: "陈怀远",
      title: "题记先作为时间锚点",
      body: "题记很重要，但现在只能先锚定时间层。它还不能单独推出墓主身份或完整关系。"
    },
    "passage:inscription_text": {
      id: "clue_passage_text",
      kicker: "关键线索",
      speaker: "记录员",
      title: "元符二年出现了",
      body: "文字读出来以后，更要克制。题记提供明确时间，但身份判断必须等后室文书和遗存一起进入。"
    },
    "passage:lattice_window": {
      id: "clue_passage_lattice",
      kicker: "线索提示",
      speaker: "考古队员",
      title: "棂窗让过道展开",
      body: "狭窄过道里却画出向两侧展开的窗格，这和顶部宝盖的收束感正好形成一组。"
    },
    "passage:ceiling_canopy": {
      id: "clue_passage_canopy",
      kicker: "线索提示",
      speaker: "陈怀远",
      title: "宝盖把空间压回中线",
      body: "过道顶部沿中心收束。等题记和棂窗一起整理，过道就会从文字点变成空间转换节点。"
    },
    "rear_chamber:rear_wall_overview": {
      id: "clue_rear_overview",
      kicker: "关键线索",
      speaker: "陈怀远",
      title: "北壁是假门结构",
      body: "先把北壁整体看成一组结构：门额、门框、门缝和妇人启门互相限定，不要只盯单个姿态。"
    },
    "rear_chamber:woman_door": {
      id: "clue_rear_woman_door",
      kicker: "关键线索",
      speaker: "记录员",
      title: "妇人启门要回到假门里",
      body: "她不是一个孤立人物，而是嵌在假门结构中的动作。判断时要让门缝和门框一起说话。"
    },
    "rear_chamber:door_gap": {
      id: "clue_rear_door_gap",
      kicker: "线索提示",
      speaker: "考古队员",
      title: "门缝是结构证据",
      body: "门缝的宽窄能把假门边界固定下来。它比单个残损细节更能进入后室主链。"
    },
    "rear_chamber:land_deed_text": {
      id: "clue_rear_deed_text",
      kicker: "关键线索",
      speaker: "陈怀远",
      title: "地券提供文书层",
      body: "地券让后室不只靠图像解释。文字、位置和出土关系要一起进入文书证据链。"
    },
    "rear_chamber:bones_nails": {
      id: "clue_rear_bones_nails",
      kicker: "关键线索",
      speaker: "考古队员",
      title: "人骨和铁钉要放回范围",
      body: "不要只数铁钉。先确认人骨、砖床边界和葬具范围，再处理数量差异。"
    },
    "rear_chamber:nail_count": {
      id: "clue_rear_nail_count",
      kicker: "存疑线索",
      speaker: "陈怀远",
      title: "数量差异需要降级",
      body: "铁钉角点差异有记录价值，但它不能单独改写后室判断。等葬具证据链成立后，把它降级为角点细节。"
    },
    "rear_chamber:distribution_map": {
      id: "clue_rear_distribution",
      kicker: "关键线索",
      speaker: "记录员",
      title: "分布图把材料放回现场",
      body: "地券、人骨、铁钉和器物分布要叠在同一张图上。后室的稳定判断来自它们的对应关系。"
    },
    "rear_chamber:rear_northwest_scissors_iron": {
      id: "clue_rear_daily_objects",
      kicker: "线索提示",
      speaker: "陈怀远",
      title: "日常器物改变后室语气",
      body: "剪刀、熨斗、灯菜和家具让后室不像只属于死亡，也像被画成一间地下居室。"
    }
  },
  puzzleCompletions: {
    mg_dig_match3: {
      id: "dig_cleanup_complete",
      kicker: "小游戏完成",
      speaker: "陈怀远",
      title: "墓门前区域已经清理",
      body: "浮土、碎砖和杂物已经移开。现在可以把门前地面、封门砖下缘和门洞位置放在一起复核，再决定是否进入甬道。"
    },
    tomb_gate_pipe_trace: {
      id: "pipe_trace_complete",
      kicker: "小游戏完成",
      speaker: "考古技工",
      title: "暗线已经连通",
      body: "暗线连通后，门洞和甬道的衔接更清楚了。它只能说明通行关系被整理出来，最终还要回到墓门章节判断。"
    },
    tomb_gate_rune_verify: {
      id: "rune_verify_complete",
      kicker: "小游戏完成",
      speaker: "记录员",
      title: "墓门验证完成",
      body: "从外到内的顺序已经整理好。封门、门额和门洞可以合成墓门章节判断。"
    },
    corridor_pattern_align: {
      id: "pattern_align_complete",
      kicker: "小游戏完成",
      speaker: "陈怀远",
      title: "叠胜纹完成拼合",
      body: "九块残片重新闭合后，偏移不再只是视觉错觉。顶部、刀刮痕和两壁导向可以进入甬道三面合读。"
    },
    mg_inscription_reading: {
      id: "inscription_reading_complete",
      kicker: "小游戏完成",
      speaker: "陈怀远",
      title: "题记辨读完成",
      body: "元符二年和赵大翁称谓已经出现，但它们仍只是时间与称谓锚点。过道收束时要保留存疑边界。"
    },
    mg_rear_relic_position: {
      id: "relic_position_complete",
      kicker: "小游戏完成",
      speaker: "记录员",
      title: "后室遗物定位完成",
      body: "地券、人骨、铁钉和器物已经回到展开图册。后室判断现在可以从图像、文书和遗存三条线合并。"
    }
  },
  sceneCompletions: {
    environment: [
      {
        id: "complete_environment_route",
        kicker: "墓外收束",
        speaker: "粟柏年",
        title: "路线先定下来",
        body: "墓群位置和 M1 空间序列已经确认。接下来按墓道、墓门、甬道、前室、过道、后室推进，不要让任何单点线索脱离这条路线。"
      },
      {
        id: "complete_environment_family_clue",
        kicker: "墓外收束",
        speaker: "林砚秋",
        title: "银扣暂存",
        body: "银扣和外祖父线索先暂存为私人线，不进入考古结论。它会跟着路线往里走，但每一次判断仍要回到现场材料。"
      }
    ],
    tomb_gate: [
      {
        id: "complete_tomb_gate_structure",
        kicker: "章节剧情",
        speaker: "陈怀远",
        title: "前后两面分开标",
        body: "墓门正面、背面和封门方式已经拆开。背面彩画的位置先标在图上，别和正面题字混成一条。"
      },
      {
        id: "complete_tomb_gate_next",
        kicker: "章节完成",
        speaker: "考古领队",
        title: "进入甬道",
        body: "墓门章节判断已经成立。接下来向内看，甬道会说明这道入口怎样把外部空间继续推向前室。"
      }
    ],
    corridor: [
      {
        id: "complete_corridor_three_faces",
        kicker: "章节剧情",
        speaker: "粟柏年",
        title: "三面合读",
        body: "顶部、两壁放在一组。不要只看装饰。方向关系先记清楚。"
      },
      {
        id: "complete_corridor_next",
        kicker: "章节完成",
        speaker: "粟柏年",
        title: "前室开放",
        body: "甬道判断成立。进前室。先看整体，不急着追单点。"
      }
    ],
    front_chamber: [
      {
        id: "complete_front_chamber_order",
        kicker: "章节剧情",
        speaker: "粟柏年",
        title: "前室先合看",
        body: "女乐、器物、入口分区和顶部结构都已进入复查。单幅图像不能替你完成判断。"
      },
      {
        id: "complete_front_chamber_next",
        kicker: "章节完成",
        speaker: "粟柏年",
        title: "转入过道",
        body: "前室判断成立。进过道。题记要看，结构也要看。"
      }
    ],
    passage: [
      {
        id: "complete_passage_anchor",
        kicker: "章节剧情",
        speaker: "粟柏年",
        title: "题记是锚点，不是终点",
        body: "赵大翁和元符二年先作时间、称谓锚点。不能替代后室文书和遗存。"
      },
      {
        id: "complete_passage_next",
        kicker: "章节完成",
        speaker: "粟柏年",
        title: "进入后室",
        body: "过道判断成立。进后室。图像、地券、葬具和日常器物分栏。"
      }
    ],
    rear_chamber: [
      {
        id: "complete_rear_chamber_home",
        kicker: "章节剧情",
        speaker: "粟柏年",
        title: "后室像一间地下居室",
        body: "假门、妇人启门、地券、人骨、铁钉和日常器物已经互相牵连。可以这样想，但先分栏。"
      },
      {
        id: "complete_rear_chamber_boundary",
        kicker: "章节完成",
        speaker: "粟柏年",
        title: "保留存疑边界",
        body: "手部断口和铁钉数量降级为辅助记录。进终章前，把确定、可推测和仍存疑分开放。"
      },
      {
        id: "complete_rear_chamber_f_line",
        kicker: "F 线暂存",
        speaker: "林砚秋",
        title: "暗格和赵怀诚线",
        body: "暗格、反切和赵怀诚线只进入 F 线：它们有剧情张力，也能作为可推测/仍存疑材料进入终章三栏报告，但不能直接改写后室学术结论。"
      }
    ],
    final_report: [
      {
        id: "complete_final_report",
        kicker: "终章汇总",
        speaker: "粟柏年",
        title: "三栏报告成立",
        body: "墓门、甬道、前室、过道和后室已经收束。赵怀诚线可以暂存，不能反向改写 P0 证据。"
      },
      {
        id: "complete_archive",
        kicker: "封存",
        speaker: "粟柏年",
        title: "阶段性研究判断",
        body: "M1 的判断不来自单一异常。空间、图像、文字和遗物要合看。报告可以封存，疑问继续保留。"
      }
    ]
  }
};

const ANALYSIS_DATA = {
  classificationOptions: [
    {
      id: "fact",
      label: "事实记录",
      shortLabel: "事实",
      statusClass: "met",
      description: "位置、数量、文字或器物存在本身，可以先作为客观记录。"
    },
    {
      id: "evidence",
      label: "可合并推测",
      shortLabel: "合看",
      statusClass: "generated",
      description: "需要和同组线索放在一起核对，之后才能支撑阶段判断。"
    },
    {
      id: "doubt",
      label: "存疑点",
      shortLabel: "存疑",
      statusClass: "partial",
      description: "看起来可疑，但现在不能单独拿来下结论。"
    },
    {
      id: "detail",
      label: "补充细节",
      shortLabel: "补充",
      statusClass: "locked",
      description: "有观察价值，但不支撑本章主判断。"
    }
  ],
  journalTracks: [
    { id: "observation", label: "观察记录", emptyText: "先在场景中收集能进入分析流程的现场观察。" },
    { id: "review", label: "证据组合", emptyText: "合看核对后的记录会在满足条件后出现在这里。" },
    { id: "pending", label: "存疑点", emptyText: "目前没有需要暂存疑问的线索。" },
    { id: "excluded", label: "已降级", emptyText: "被降级为补充细节的线索会收在这里。" }
  ],
  sceneWorkflows: {
    tomb_gate: {
      chapter: "墓门",
      reviewSteps: [
        {
          id: "review_surface_compare",
          buttonLabel: "用手电和拓片纸核对门额前后",
          description: "把正面题字与背面彩画放在一起，确认它们是否来自同一处理层。",
          sourceRecordIds: ["tomb_gate:lintel", "tomb_gate:lintel_back"],
          resultRecord: {
            id: "analysis:tomb_gate:review_surface_compare",
            sceneId: "tomb_gate",
            title: "门额前后层次核对",
            text: "手电与拓片复查显示，门额正面题字和背面卷草纹不在同一处理层；背面朱红底与下缘裁切线提示门额前后经历过不同层次的处理。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_sealing_structure",
          buttonLabel: "用标尺核对封门方式",
          description: "把封门砖缝和门前地面一起看，判断灰缝异常是否真能上升为主线。",
          sourceRecordIds: ["tomb_gate:brick_seam", "tomb_gate:threshold"],
          resultRecord: {
            id: "analysis:tomb_gate:review_sealing_structure",
            sceneId: "tomb_gate",
            title: "封门方式核对",
            text: "标尺复查显示，石英砂灰缝与周围胶结状态一致，砖下缘和地面交界连续。石英砂归入封门砌筑细节。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      pendingResolutions: [
        {
          recordId: "tomb_gate:brick_seam",
          buttonLabel: "将石英砂灰缝降级为补充细节",
          description: "单点颗粒异常不足以直接进入主线结论。",
          requiresReviewRecordIds: ["analysis:tomb_gate:review_sealing_structure"],
          resolutionText: "封门砖缝中的石英砂已被降级为补充细节；它归入砌筑细节，不进入墓门主线判断。"
        }
      ],
      combination: {
        buttonLabel: "形成墓门章节组合判断",
        description: "把门额前后层次和封门方式两组核对结果合并，生成墓门的阶段性判断。",
        requiresReviewRecordIds: ["analysis:tomb_gate:review_surface_compare", "analysis:tomb_gate:review_sealing_structure"],
        requiresExcludedRecordIds: ["tomb_gate:brick_seam"],
        resultRecord: {
          id: "analysis:tomb_gate:combo",
          sceneId: "tomb_gate",
          title: "墓门组合判断",
          text: "门额前后层次不一致与封门结构复查共同说明，墓门不仅是入口，也是第一道需要谨慎辨别的证据界面。",
          track: "review",
          recordType: "combination"
        }
      }
    },
    corridor: {
      chapter: "甬道",
      reviewSteps: [
        {
          id: "review_roof_alignment",
          buttonLabel: "用手电和标尺核对顶部错位",
          description: "把顶部整体、叠胜彩画和起拱边线放进同一组，确认错位是否真成立。",
          sourceRecordIds: ["corridor:corridor_roof", "corridor:overlapping_pattern", "corridor:roof_arch_line"],
          resultRecord: {
            id: "analysis:corridor:review_roof_alignment",
            sceneId: "corridor",
            title: "顶部错位核对",
            text: "甬道顶部整体、叠胜彩画偏移和起拱边线一起复查后，可以确认顶部并非单纯装饰，而保留了调整与重整的痕迹。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_direction",
          buttonLabel: "用结构图核对通道导向",
          description: "把甬道中段和两壁方向放在一起，判断甬道是否承担引导功能。",
          sourceRecordIds: ["corridor:corridor_mid", "corridor:east_wall_direction", "corridor:west_wall_inscription"],
          resultRecord: {
            id: "analysis:corridor:review_direction",
            sceneId: "corridor",
            title: "通道导向核对",
            text: "结构图复查表明，甬道中段的压缩感与两壁画面朝向共同把视线推向前室，甬道承担的是过渡与引导功能。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      combination: {
        buttonLabel: "形成甬道章节组合判断",
        description: "把顶部错位和通道导向两条核对链合并，生成甬道阶段判断。",
        requiresReviewRecordIds: ["analysis:corridor:review_roof_alignment", "analysis:corridor:review_direction"],
        resultRecord: {
          id: "analysis:corridor:combo",
          sceneId: "corridor",
          title: "甬道组合判断",
          text: "甬道顶部错位与两壁导向共同说明，这里承担的不是静态陈设，而是将空间压向前室的过渡和引导功能。",
          track: "review",
          recordType: "combination"
        }
      }
    },
    front_chamber: {
      chapter: "前室",
      reviewSteps: [
        {
          id: "review_artifact_tension",
          buttonLabel: "用标尺和对照图核对西壁器物",
          description: "把注子、高瓶和砖砌桌放进同一组，确认前室器物是否来自同一时间层。",
          sourceRecordIds: ["front_chamber:ewer", "front_chamber:high_bottle", "front_chamber:brick_table"],
          resultRecord: {
            id: "analysis:front_chamber:review_artifact_tension",
            sceneId: "front_chamber",
            title: "器物年代与重绘核对",
            text: "标尺与对照图复查显示，西壁注子与高瓶瓶座的形制深浅并不一致，再结合砖砌桌侧细槽与阴影方向错位，可确认前室器物线同时保留了年代错层和局部重绘痕迹。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_ritual_sequence",
          buttonLabel: "用结构图核对礼仪动线",
          description: "把东壁女乐、南壁入口与北壁两段画面放在一起，确认前室是否形成礼仪引导序列。",
          sourceRecordIds: ["front_chamber:female_musicians", "front_chamber:south_wall_overview", "front_chamber:north_west_mural", "front_chamber:north_east_mural"],
          resultRecord: {
            id: "analysis:front_chamber:review_ritual_sequence",
            sceneId: "front_chamber",
            title: "礼仪动线核对",
            text: "结构图复查表明，东壁女乐、南壁入口分区与北壁东西两段的密度差共同构成了从迎引、停驻到继续通行的礼仪动线，前室不是分散图像的堆叠。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_partition_structure",
          buttonLabel: "用手电核对入口分区与顶部结构",
          description: "把两侧壁函、倚柱和彩画顶部一起看，确认前室入口是否被主动分区。",
          sourceRecordIds: [
            "front_chamber:east_wall_niche",
            "front_chamber:west_wall_niche",
            "front_chamber:painted_column",
            "front_chamber:bracket_set",
            "front_chamber:northwest_corner"
          ],
          resultRecord: {
            id: "analysis:front_chamber:review_partition_structure",
            sceneId: "front_chamber",
            title: "入口分区与顶部结构核对",
            text: "手电复查显示，南壁两侧壁函与倚柱并非平均展开，而是和顶部铺作、转角构件一起构成了被明确组织过的入口分区，前室的礼仪空间判断因此获得结构支撑。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      pendingResolutions: [
        {
          recordId: "front_chamber:pointed_shoes",
          buttonLabel: "将尖鞋降级为服饰细节",
          description: "单一鞋型归入人物服饰细节。",
          requiresReviewRecordIds: ["analysis:front_chamber:review_ritual_sequence"],
          resolutionText: "女乐尖鞋已被降级为服饰细节；它归入人物形象记录，前室主线仍以礼仪动线为主。"
        },
        {
          recordId: "front_chamber:east_wall_surface",
          buttonLabel: "将东壁温差降级为体感异常",
          description: "手电照射下的短暂温差记录为局部体感差异。",
          requiresReviewRecordIds: ["analysis:front_chamber:review_partition_structure"],
          resolutionText: "东壁温差已被降级为体感异常；它保留为局部观察记录，不进入前室主线判断。"
        }
      ],
      combination: {
        buttonLabel: "形成前室章节组合判断",
        description: "把器物、礼仪动线和入口分区三条核对链合并，生成前室阶段判断。",
        requiresReviewRecordIds: [
          "analysis:front_chamber:review_artifact_tension",
          "analysis:front_chamber:review_ritual_sequence",
          "analysis:front_chamber:review_partition_structure"
        ],
        requiresExcludedRecordIds: ["front_chamber:pointed_shoes", "front_chamber:east_wall_surface"],
        resultRecord: {
          id: "analysis:front_chamber:combo",
          sceneId: "front_chamber",
          title: "前室组合判断",
          text: "西壁器物的年代错层与局部重绘、东壁至北壁的礼仪动线，以及南壁到顶部的入口分区共同说明，前室是被主动组织过的礼仪展示空间；尖鞋和体感温差归入辅助记录。",
          track: "review",
          recordType: "combination"
        }
      }
    },
    rear_chamber: {
      chapter: "后室",
      reviewSteps: [
        {
          id: "review_false_door_structure",
          buttonLabel: "用手电和结构图核对假门图像",
          description: "把北壁整体、妇人启门和门缝槽口放在一起，确认假门图像是否构成稳定的主链。",
          sourceRecordIds: ["rear_chamber:rear_wall_overview", "rear_chamber:woman_door", "rear_chamber:door_gap"],
          resultRecord: {
            id: "analysis:rear_chamber:review_false_door_structure",
            sceneId: "rear_chamber",
            title: "假门图像核对",
            text: "手电与结构图复查显示，后室北壁假门、妇人启门姿态与门缝槽口宽度可以互相印证，这不是孤立的人物图像，而是一组被明确组织过的假门图像线索。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_document_layer",
          buttonLabel: "用拓片纸核对地券文书",
          description: "把地券整体、券文和行列字数放进同一组，确认文书本身是否足以进入主链。",
          sourceRecordIds: ["rear_chamber:land_deed", "rear_chamber:land_deed_text", "rear_chamber:land_deed_lines"],
          resultRecord: {
            id: "analysis:rear_chamber:review_document_layer",
            sceneId: "rear_chamber",
            title: "地券文书核对",
            text: "拓片复查显示，地券的朱书层、县村书写方式与行列字数变化共同说明，这份文书不仅能确认后室身份线，也保留了需要谨慎辨析的处理层次。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_burial_distribution",
          buttonLabel: "串联葬具证据链",
          description: "按砖床边界、人骨与铁钉、出土物分布、地券文书的顺序整理后室葬具材料。",
          sourceRecordIds: [
            "rear_chamber:north_lower_bed_boundary",
            "rear_chamber:bones_nails",
            "rear_chamber:bones_position_burial_range",
            "rear_chamber:nail_count",
            "rear_chamber:distribution_map",
            "rear_chamber:land_deed_body_text_panel"
          ],
          progressLabel: "后室葬具证据链点击顺序",
          guideSteps: [
            {
              label: "1 北壁下部",
              detail: "后室入口总览 → 北壁 → 北壁下部；点砖床边界。",
              mobileDetail: "北壁 → 北壁下部；点砖床边界。",
              recordIds: ["rear_chamber:north_lower_bed_boundary"]
            },
            {
              label: "2 人骨铁钉",
              detail: "北壁 → 人骨与铁钉；在人骨近景点铁钉数量。",
              mobileDetail: "北壁 → 人骨与铁钉；点铁钉数量。",
              recordIds: ["rear_chamber:bones_nails", "rear_chamber:nail_count"]
            },
            {
              label: "3 分布与人骨位置",
              detail: "北壁 → 出土物分布图 → 人骨位置。",
              mobileDetail: "北壁 → 分布图 → 人骨位置。",
              recordIds: ["rear_chamber:distribution_map", "rear_chamber:bones_position_burial_range"]
            },
            {
              label: "4 地券并盖",
              detail: "北壁 → 地券 → 地券并盖 → 地券本体。",
              mobileDetail: "北壁 → 地券 → 地券并盖 → 地券本体。",
              recordIds: ["rear_chamber:land_deed_body_text_panel"]
            }
          ],
          chainItems: [
            { label: "砖床", role: "空间基准", detail: "北壁下部边界限定遗存范围" },
            { label: "人骨", role: "遗存主体", detail: "放回葬具范围内判断分布" },
            { label: "铁钉", role: "葬具痕迹", detail: "角点数字降级为范围线索" },
            { label: "地券", role: "文书层", detail: "补充位置与制度语境" }
          ],
          resultRecord: {
            id: "analysis:rear_chamber:review_burial_distribution",
            sceneId: "rear_chamber",
            title: "葬具证据链核对",
            text: "小面板复查显示，砖床边界限定后室遗存的空间范围，人骨和铁钉在这个范围内叠合，地券作为文书层补充定位；较稳定的主证是遗存、痕迹和文书之间的对应关系。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      pendingResolutions: [
        {
          recordId: "rear_chamber:woman_hand",
          priority: 10,
          buttonLabel: "将妇人手部新断口降级为局部残损",
          description: "单一手指断口记录为局部残损或后期破坏。",
          requiresReviewRecordIds: ["analysis:rear_chamber:review_false_door_structure"],
          blockedText: "先完成假门图像核对，再处理这条手部断口。北壁假门、妇人启门和门缝槽口需要作为同一组图像结构记录。",
          readyText: "假门图像核对已完成。现在可以把手部断口降级为局部残损，避免它单独替代北壁假门结构判断。",
          resolutionText: "妇人手部新断口已被降级为局部残损；它记录为后期破坏痕迹，后室主线仍以假门整体结构为主。"
        },
        {
          recordId: "rear_chamber:nail_count",
          priority: 20,
          buttonLabel: "将铁钉数量异常降级为角点细节",
          description: "铁钉数量差异放入砖床、人骨位置和地券文书的同一条证据链中整理。",
          requiresReviewRecordIds: ["analysis:rear_chamber:review_burial_distribution"],
          blockedText: "先完成葬具证据链核对，再处理铁钉数量。原因是东北角、西南角的钉数差只能说明角点细节，必须和砖床边界、人骨范围、地券文书一起判断。",
          readyText: "葬具证据链核对已完成。现在可以把铁钉数量异常降级为角点细节：它参与说明葬具痕迹。",
          resolutionText: "铁钉数量异常已被降级为角点细节；它归入砖床边界、人骨范围和地券文书的整体关系。"
        }
      ],
      combination: {
        buttonLabel: "形成后室章节组合判断",
        description: "把假门图像、地券文书和葬具证据链三组核对结果合并，生成后室阶段判断。",
        progressLabel: "后室组合判断生成条件",
        requiresReviewRecordIds: [
          "analysis:rear_chamber:review_false_door_structure",
          "analysis:rear_chamber:review_document_layer",
          "analysis:rear_chamber:review_burial_distribution"
        ],
        requiresExcludedRecordIds: ["rear_chamber:woman_hand", "rear_chamber:nail_count"],
        requirementSteps: [
          {
            id: "analysis:rear_chamber:review_false_door_structure",
            label: "1 假门图像核对",
            missingText: "先完成北壁整体、妇人启门和门缝槽口的核对。",
            metText: "假门图像核对已完成。"
          },
          {
            id: "analysis:rear_chamber:review_document_layer",
            label: "2 地券文书核对",
            missingText: "先完成地券整体、券文和行列关系的核对。",
            metText: "地券文书核对已完成。"
          },
          {
            id: "analysis:rear_chamber:review_burial_distribution",
            label: "3 葬具证据链核对",
            missingText: "先完成砖床、人骨、铁钉和地券之间的证据链核对。",
            metText: "葬具证据链核对已完成。"
          },
          {
            excludedId: "rear_chamber:woman_hand",
            label: "4 降级手部断口",
            missingText: "在存疑处理中把妇人手部断口降级为局部残损。",
            metText: "妇人手部断口已降级。"
          },
          {
            excludedId: "rear_chamber:nail_count",
            label: "5 降级铁钉数量",
            missingText: "在存疑处理中把铁钉数量异常降级为角点细节。",
            metText: "铁钉数量异常已降级。"
          }
        ],
        resultRecord: {
          id: "analysis:rear_chamber:combo",
          sceneId: "rear_chamber",
          title: "后室组合判断",
          text: "假门图像、地券文书与葬具证据链共同说明，后室核心证据来自图像、文书和遗存的互相印证；手部断口和角点钉数归入辅助记录。",
          track: "review",
          recordType: "combination"
        }
      }
    },
    passage: {
      chapter: "过道",
      reviewSteps: [
        {
          id: "review_inscription_layer",
          buttonLabel: "用手电和拓片纸核对题记层次",
          description: "把题记整体、文字和下沿放在一起，判断文字与壁画是否同层。",
          sourceRecordIds: ["passage:inscription", "passage:inscription_text", "passage:inscription_lower_edge"],
          resultRecord: {
            id: "analysis:passage:review_inscription_layer",
            sceneId: "passage",
            title: "题记层次核对",
            text: "题记整体、文字与下沿复查后，可以确认低处浓墨与周围壁画色层关系并不简单，过道保留了明确的时间层信息。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_spatial_structure",
          buttonLabel: "用结构图核对窗棂与宝盖",
          description: "把棂窗、窗格线条和顶部宝盖合并，判断过道的空间组织方式。",
          sourceRecordIds: ["passage:lattice_window", "passage:lattice_lines", "passage:ceiling_canopy", "passage:canopy_center"],
          resultRecord: {
            id: "analysis:passage:review_spatial_structure",
            sceneId: "passage",
            title: "窗棂与宝盖核对",
            text: "结构图复查显示，棂窗侧向展开而宝盖沿中线收束，过道在狭窄空间里同时承担展开与压缩两种作用。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      combination: {
        buttonLabel: "形成过道章节组合判断",
        description: "把题记层次与空间结构两条核对链合并，生成过道阶段判断。",
        requiresReviewRecordIds: ["analysis:passage:review_inscription_layer", "analysis:passage:review_spatial_structure"],
        resultRecord: {
          id: "analysis:passage:combo",
          sceneId: "passage",
          title: "过道组合判断",
          text: "题记层次与窗棂、宝盖的空间复查共同说明，过道是时间信息与空间转换交汇的节点。",
          track: "review",
          recordType: "combination"
        }
      }
    }
  }
};

window.M1_GAME_DATA = {
  SAVE_KEY,
  START_SCENE_ID,
  POSITION_MAP,
  SCENES,
  CONCLUSION_DATA,
  NPC_DATA,
  ANALYSIS_DATA
};
})();

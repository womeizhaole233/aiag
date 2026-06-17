(function () {
const SAVE_KEY = "m1-analysis-rebuild-state-v1";
const START_SCENE_ID = "environment";
const POSITION_MAP = {
  image: {
    src: "assets/M1/00_墓葬全景与结构图/一号墓平剖面图.png",
    alt: "第一号墓平剖面图"
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
    environment: {
      label: "墓外",
      x: 0.29,
      y: 0.86
    },
    tomb_gate: {
      label: "墓门",
      x: 0.31,
      y: 0.78
    },
    corridor: {
      label: "甬道",
      x: 0.33,
      y: 0.68
    },
    front_chamber: {
      label: "前室",
      x: 0.35,
      y: 0.58
    },
    passage: {
      label: "过道",
      x: 0.37,
      y: 0.5
    },
    rear_chamber: {
      label: "后室",
      x: 0.39,
      y: 0.42
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
    passage_tassel_closeup: "过道 / 流苏近景",
    front_overview: "前室 / 入口总览",
    front_west: "前室 / 面向西壁",
    front_east: "前室 / 面向东壁",
    front_south: "前室 / 面向南壁",
    front_north_west: "前室 / 面向北壁西部",
    front_north_east: "前室 / 面向北壁东部",
    front_ceiling: "前室 / 抬头看顶部",
    front_ceiling_northwest_closeup: "前室 / 西北角近景",
    front_south_east_niche_closeup: "前室 / 南壁东部壁函近景",
    front_south_west_niche_closeup: "前室 / 南壁西部壁函近景",
    front_south_column_closeup: "前室 / 南壁倚柱彩画近景",
    front_west_bottle_closeup: "前室 / 西壁高瓶近景",
    front_west_entry_closeup: "前室 / 西壁入口关系",
    front_west_table_closeup: "前室 / 西壁砖砌桌近景",
    front_east_shoes_closeup: "前室 / 东壁尖鞋近景",
    front_west_ewer_closeup: "前室 / 西壁注子近景",
    rear_overview: "后室 / 入口总览",
    rear_plan_section: "后室 / 平剖面结构图",
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
            label: "白沙位置",
            shape: "rect",
            rect: [0.12, 0.18, 0.54, 0.62],
            title: "白沙宋墓位置",
            body: "地形图先把墓葬放回白沙区域。\n墓址不是孤立的室内谜题，而是嵌在地貌、村落和墓群关系中的考古对象。",
            record: "白沙宋墓的位置需要先从区域地形中确认，墓葬空间与外部地貌、村落关系有关。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓外环境线索精修版_v1.0.md",
            sourceClueId: "ENV-E-02"
          },
          {
            id: "m1_sequence_map",
            label: "M1空间序列",
            navLabel: "查看平剖面",
            shape: "rect",
            rect: [0.58, 0.18, 0.95, 0.72],
            title: "M1空间序列",
            body: "进入墓门之前，先把墓外、墓门、甬道、前室、过道、后室的顺序建立起来。",
            record: "M1的观察顺序应从墓外环境开始，沿墓门、甬道、前室、过道进入后室。",
            sourceFile: "docs/handoff/线索交付文档/05_剧情体验交付/M1场景线索体验节奏表_v1.0.md",
            sourceClueId: "ENV-P0-01",
            viewTransition: {
              targetViewId: "environment_sequence",
              title: "查看M1空间序列",
              body: "平剖面图可以先建立后续章节的位置关系。",
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
              title: "前往墓门",
              body: "你离开地形图视角，转到第一号墓墓门前。",
              closeLabel: "前往"
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
            label: "六段空间",
            shape: "rect",
            rect: [0.18, 0.2, 0.82, 0.76],
            title: "六段空间顺序",
            body: "平剖面图把第一号墓的空间压缩成一条可读的轴线。\n后续所有墙面、题记、器物和葬具线索，都要回到这个轴线里定位。",
            record: "第一号墓可按墓外、墓门、甬道、前室、过道、后室的顺序建立空间轴线。",
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
            body: "从平剖面返回到墓门外部，可以观察进入墓门前的空间关系。",
            record: "墓门外围图可补足从墓外环境进入墓门前的空间关系。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
            sourceClueId: "GATE-E-01",
            viewTransition: {
              targetViewId: "environment_outer_gate",
              title: "查看墓门外围",
              body: "视角转到第一号墓外围。",
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
          src: "assets/M1/02墓道与墓门/第一号墓外围.png",
          alt: "第一号墓外围",
          width: 4693,
          height: 3520
        },
        hotspots: [
          {
            id: "outer_gate_relation",
            label: "墓门外围关系",
            shape: "rect",
            rect: [0.16, 0.12, 0.84, 0.78],
            title: "第一号墓外围",
            body: "外围照片让墓门不再只是单独的正面图。\n玩家可以先看到入口与周围空间的关系，再进入墓门细节。",
            record: "第一号墓外围图补充了墓门与外部空间的关系。",
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
            body: "从外围进入第一号墓墓门主视角。",
            record: "从外围进入第一号墓墓门。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "tomb_gate",
              targetViewId: "tomb_gate_main",
              unlocked: true,
              title: "进入墓门",
              body: "墓门正面进入视野，门额、封门砖和门洞都可以细看。",
              closeLabel: "进入"
            }
          },
          {
            id: "return_sequence_from_outer",
            label: "返回平剖面",
            navLabel: "返回平剖面",
            shape: "rect",
            rect: [0, 0.82, 0.24, 1],
            title: "返回平剖面",
            body: "回到空间序列图，重新确认墓门在整体轴线中的位置。",
            record: "返回M1空间序列图。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "environment_sequence",
              title: "返回平剖面",
              body: "视角回到第一号墓平剖面。",
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
          src: "assets/M1/02墓道与墓门/第一号墓墓门(彭华士摄).png",
          alt: "第一号墓墓门",
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
            body: "返回墓外环境，可以重新查看白沙位置和M1空间序列。",
            record: "返回墓外环境复查。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "environment",
              targetViewId: "environment_outer_gate",
              unlocked: true,
              title: "返回墓外",
              body: "视角退回第一号墓外围。",
              closeLabel: "返回"
            }
          },
          {
            id: "lintel",
            label: "墓门门额",
            shape: "rect",
            rect: [0.37, 0.14, 0.63, 0.31],
            title: "墓门门额",
            body: "墓门门额正面题有墓主信息。\n门额背面可见一幅完整的卷草纹彩画。\n正面为题字，背面为彩画，质地与图像均不相同。",
            record: "墓门门额正面题有墓主信息，背面可见完整卷草纹彩画。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "L07",
            viewTransition: {
              targetViewId: "tomb_gate_lintel_back",
              title: "查看门额背面彩画",
              body: "门额背面彩画适合用单独图像查看。",
              closeLabel: "查看"
            }
          },
          {
            id: "lintel_back",
            label: "门额上沿阴影",
            shape: "rect",
            rect: [0.39, 0.07, 0.61, 0.17],
            title: "门额背面彩画",
            body: "墓门门额背面可见完整卷草纹彩画。\n卷草以墨线勾勒，青绿填色，纹样从中心向两侧延伸，总长约一尺八寸。\n背面朱红底色与正面白灰层质地不同，卷草纹下边缘有一道水平裁切线。",
            record: "门额背面有完整卷草纹彩画，总长约一尺八寸；背面朱红底色与正面白灰层质地不同，下缘见水平裁切线。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "L07",
            viewTransition: {
              targetViewId: "tomb_gate_lintel_back",
              title: "查看门额背面彩画",
              body: "切换到门额背面彩画近景。",
              closeLabel: "查看"
            }
          },
          {
            id: "brick_seam",
            label: "封门砖缝",
            shape: "rect",
            rect: [0.28, 0.39, 0.43, 0.76],
            title: "封门砖缝",
            body: "墓门外层封门砖的灰缝中嵌着几粒石英砂，在手电下闪着细小的光点。\n石英砂粒径约半分，与本地夯土中常见的石英砂一致。\n石英砂与石灰浆的胶结状态与周围灰缝一致。",
            record: "封门砖灰缝中可见石英砂光点，粒径约半分；其与石灰浆胶结状态和周围灰缝一致。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "H01",
            viewTransition: {
              targetViewId: "tomb_gate_brick_structure",
              title: "查看封门砖组织",
              body: "封门砖组织图可以帮助复核砖缝和封堵方式。",
              closeLabel: "查看"
            }
          },
          {
            id: "door_opening",
            label: "门洞深处",
            navLabel: "进入甬道",
            shape: "rect",
            rect: [0.44, 0.36, 0.56, 0.8],
            title: "门洞深处",
            body: "墓门后部与甬道东壁相接。\n门洞内侧光线较暗，通道向墓室深处收窄。\n门额、门框与甬道侧壁在此处衔接。",
            record: "墓门后部与甬道相接，门额、门框与甬道侧壁在此处衔接。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "S02-TRANSITION",
            transition: {
              targetSceneId: "corridor",
              targetViewId: "corridor_overview",
              title: "进入甬道",
              body: "墓门的几处信息已经记录。\n门洞之后，甬道顶部压低。\n光线沿砖缝向内收窄，前方可以继续观察。",
              closeLabel: "进入",
              lockedBody: "门洞深处光线较暗。\n入口信息尚未整理完整。",
              missingRecords: [
                { id: "tomb_gate:lintel_back", label: "门额背面彩画" },
                { sceneId: "tomb_gate", minCount: 3, label: "墓门区域至少三条观察记录" }
              ]
            }
          },
          {
            id: "left_wall",
            label: "左侧墙面",
            shape: "rect",
            rect: [0.05, 0.28, 0.25, 0.72],
            title: "墓道墙面",
            body: "手电光扫过墓道壁面时，某些砖缝渗出的水珠在手电玻璃罩上凝成一层细雾。\n越靠近墓门，雾越浓。\n水汽无固定来源，不同砖缝渗出量不一致。",
            record: "墓道砖缝渗出的水珠可在手电玻璃罩上凝成细雾；越靠近墓门，雾越浓。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "E01"
          },
          {
            id: "threshold",
            label: "门前地面",
            shape: "rect",
            rect: [0.32, 0.79, 0.68, 0.96],
            title: "门前地面",
            body: "门前地面位于墓道与墓门之间。\n地面色泽较暗，尘土沿门洞前缘沉积。\n封门砖下缘与地面交界处仍可辨认。",
            record: "门前地面位于墓道与墓门之间，封门砖下缘与地面交界处可辨认。",
            sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
            sourceClueId: "ENV-S02",
            viewTransition: {
              targetViewId: "tomb_gate_outer",
              title: "查看墓门外围",
              body: "门前地面和外围环境需要放在一起理解。",
              closeLabel: "查看"
            }
          }
        ]
      },
      tomb_gate_outer: {
        id: "tomb_gate_outer",
        title: "第一号墓外围",
        image: {
          src: "assets/M1/02墓道与墓门/第一号墓外围.png",
          alt: "第一号墓外围",
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
            body: "外围图补足墓门正面照片看不到的进入关系。\n它更适合作为墓外环境与墓门主视图之间的过渡。",
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
            label: "卷草纹彩画",
            shape: "rect",
            rect: [0.08, 0.24, 0.92, 0.74],
            title: "门额背面卷草纹",
            body: "背面彩画把墓门线索从正面题字扩展到背面装饰。\n这里可以作为后续美工重绘或局部放大 UI 的重点。",
            record: "门额背面卷草纹彩画可作为墓门结构与装饰关系的重点图像线索。",
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
            label: "返回墓门",
            navLabel: "返回墓门",
            shape: "rect",
            rect: [0.02, 0.78, 0.26, 0.98],
            title: "返回墓门",
            body: "身后的墓门仍在暗处。\n已经进入过的区域可以回去复查。",
            record: "返回墓门复查。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "tomb_gate",
              unlocked: true,
              title: "返回墓门",
              body: "你退回墓门前。\n门额、砖缝和门洞仍可继续复查。",
              closeLabel: "返回"
            }
          },
          {
            id: "corridor_roof",
            label: "甬道顶部",
            navLabel: "抬头看顶部",
            shape: "rect",
            rect: [0.18, 0.02, 0.82, 0.26],
            title: "甬道顶部",
            body: "甬道顶部，叠胜彩画以朱红为底，青绿绘出菱形单元。\n菱形单元在正中线上方本应交错对接。\n实测东侧第三个单元的尖角与西侧偏移约两寸。",
            record: "甬道顶部叠胜彩画以朱红为底、青绿绘菱形单元；东侧第三个单元与西侧偏移约两寸。",
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
            label: "甬道中段",
            shape: "rect",
            rect: [0.30, 0.62, 0.70, 0.88],
            title: "甬道中段",
            body: "甬道内有一股淡淡的苦杏仁味，不是泥土气，也不是朽木气。\n停留片刻就散了，换个位置再嗅，又出现，再散。\n气味没有固定来源，且只在甬道中段可闻。",
            record: "甬道中段可闻淡淡苦杏仁味；气味非泥土气、非朽木气，无固定来源。",
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
        label: "甬道中段",
        shape: "rect",
        rect: [0.24, 0.66, 0.76, 0.88],
        title: "甬道中段",
        body: "甬道内有一股淡淡的苦杏仁味，不是泥土气，也不是朽木气。\n停留片刻就散了，换个位置再嗅，又出现，再散。\n气味没有固定来源，且只在甬道中段可闻。",
        record: "甬道中段可闻淡淡苦杏仁味；气味非泥土气、非朽木气，无固定来源。",
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
        body: "偏移处砖缝有一道刀刮痕，长约三寸。\n刀刮痕将原有菱形边界刮除后重绘。\n刮痕下方白灰层颜色较周围略黄，叠胜纹南端为六瓣花芯，北端变为四瓣。",
        record: "叠胜彩画偏移处有约三寸刀刮痕，原有菱形边界被刮除后重绘；刮痕下方白灰层略黄。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "L06",
        viewTransition: {
          targetViewId: "corridor_roof_pattern_closeup",
          title: "查看叠胜彩画近景",
          body: "叠胜彩画可以用独立图片复看纹样和偏移关系。",
          closeLabel: "查看"
        }
      },
      {
        id: "roof_arch_line",
        label: "甬道顶线",
        shape: "rect",
        rect: [0.18, 0.23, 0.82, 0.34],
        title: "甬道顶线",
        body: "甬道顶部起拱线比前室低三寸。\n行走时头部距顶约两尺。\n顶部彩画因此压近视线。",
        record: "甬道顶部起拱线比前室低三寸，行走时头部距顶约两尺。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "L06"
      },
      {
        id: "return_tomb_gate",
        label: "返回墓门",
        navLabel: "返回墓门",
        shape: "rect",
        rect: [0.02, 0.82, 0.26, 0.98],
        title: "返回墓门",
        body: "身后的墓门仍在暗处。\n已经进入过的区域可以回去复查。",
        record: "返回墓门复查。",
        sourceFile: "game-navigation",
        sourceClueId: "NAV",
        transition: {
          targetSceneId: "tomb_gate",
          unlocked: true,
          title: "返回墓门",
          body: "你退回墓门前。\n门额、砖缝和门洞仍可继续复查。",
          closeLabel: "返回"
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
            body: "这张近景图把甬道顶部叠胜彩画从整体顶面中拆出来。\n后续美工可以在这里强化纹样、偏移点和局部复查 UI。",
            record: "甬道顶叠胜彩画近景可用于复查纹样、偏移点和顶部彩画层次。",
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
            label: "人物与器物朝向",
            shape: "rect",
            rect: [0.06, 0.2, 0.44, 0.78],
            title: "东壁人物与器物朝向",
            body: "甬道东壁壁画沿通道展开。\n人物衣褶与器物朝向大体向墓室深处收束。\n对应题字位置留白较宽，可与西壁题字区域对照。",
            record: "甬道东壁壁画沿通道展开，人物衣褶与器物朝向大体向墓室深处收束；对应题字位置留白较宽。",
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
            label: "题字区域",
            shape: "rect",
            rect: [0.56, 0.2, 0.94, 0.78],
            title: "西壁题字区域",
            body: "甬道西壁题字位于窗下较低处。\n题字更接近人物手部高度，周围留白较宽。\n两壁题字区中心高度相差约二寸。",
            record: "甬道西壁题字位于窗下较低位置，更接近人物手部高度；两壁题字区中心高度相差约二寸。",
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
            body: "过道东壁沿狭窄通道展开。\n壁面图像与前室相接，画面向后室方向延伸。\n东壁上部与顶部构件相邻，空间比前室更收窄。",
            record: "过道东壁沿狭窄通道展开，壁面图像向后室方向延伸。",
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
            rect: [0.70, 0.30, 0.90, 0.58],
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
            id: "tassel",
            label: "流苏",
            shape: "rect",
            rect: [0.80, 0.22, 0.96, 0.70],
            title: "流苏",
            body: "过道壁画中可见流苏。\n流苏方向略有偏转，线条随悬挂位置下垂。\n局部线条仍可辨认。",
            record: "过道壁画中可见流苏，方向略有偏转，局部线条仍可辨认。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "H03",
            closeupTransition: {
              targetViewId: "passage_tassel_closeup",
              title: "靠近观察流苏",
              body: "流苏细部被放大。\n偏转方向和悬挂线条可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "ceiling_canopy",
            label: "顶部宝盖",
            shape: "rect",
            rect: [0.18, 0.02, 0.82, 0.26],
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
            id: "rear_entry_relation",
            label: "后室入口方向",
            shape: "rect",
            rect: [0.18, 0.14, 0.82, 0.78],
            title: "后室入口方向",
            body: "后室入口图把过道的收束关系落到真实图像上。\n这里适合承接从前室、过道进入后室的章节转换。",
            record: "过道北壁下部后室入口图确认了从过道进入后室的方向与空间收束。",
            sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
            sourceClueId: "HS-E-01"
          },
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
              body: "过道入口之后，后室入口总览展开。\n这里开始进入M1空间序列的收束段。",
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
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道",
            body: "返回过道轴线总览。",
            record: "返回过道轴线总览。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_overview",
              title: "返回过道",
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
            id: "tassel",
            label: "流苏",
            shape: "rect",
            rect: [0.54, 0.2, 0.86, 0.52],
            title: "流苏",
            body: "过道壁画中可见流苏。\n流苏方向略有偏转，线条随悬挂位置下垂。\n局部线条仍可辨认。",
            record: "过道壁画中可见流苏，方向略有偏转，局部线条仍可辨认。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "H03",
            closeupTransition: {
              targetViewId: "passage_tassel_closeup",
              title: "靠近观察流苏",
              body: "流苏细部被放大。\n偏转方向和悬挂线条可以继续查看。",
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
            label: "返回过道总览",
            navLabel: "返回过道总览",
            shape: "rect",
            rect: [0, 0.82, 0.28, 1],
            title: "返回过道总览",
            body: "过道轴线重新进入视线。\n可以继续前往后室或返回前室。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_overview",
              title: "返回过道总览",
              body: "过道轴线重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_passage_axis_from_east",
            label: "回到过道轴线",
            navLabel: "回到轴线",
            shape: "rect",
            rect: [0.3, 0.82, 0.78, 1],
            title: "回到过道轴线",
            body: "过道总览会重新显示前后连接关系。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_overview",
              title: "回到过道轴线",
              body: "过道轴线重新进入视线。",
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
            body: "过道东壁下部题有“元符二年”四字。\n题字以浓墨书写，字径约二寸。\n墨色呈焦黑状，与周围壁画的赭红色调分层明显。",
            record: "过道东壁下部题有“元符二年”，字径约二寸；墨色较深，与周围壁画赭红色调分层明显。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L01"
          },
          {
            id: "inscription_lower_edge",
            label: "题记下沿",
            shape: "rect",
            rect: [0.2, 0.66, 0.82, 0.88],
            title: "题记下沿",
            body: "题记下沿距地面约三尺四寸。\n笔画起止处可见墨汁溢出砖缝。\n题字位置低于过道壁画主要画面。",
            record: "题记下沿距地面约三尺四寸，笔画起止处可见墨汁溢出砖缝。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L01"
          },
          {
            id: "return_passage_from_inscription",
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道",
            body: "题记位置重新回到整幅壁面之中。",
            record: "返回过道。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道",
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
            label: "窗格线条",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "窗格线条",
            body: "过道两壁绘有破子棂窗。\n窗格边线排列整齐，斜向交接清楚。\n侧向线条与前后通道方向形成交错。",
            record: "破子棂窗窗格边线排列整齐，侧向线条与前后通道方向形成交错。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14"
          },
          {
            id: "return_passage_from_lattice",
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道",
            body: "破子棂窗重新回到过道两侧关系中。",
            record: "返回过道。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道",
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
            body: "过道顶部为丁字盝顶式宝盖。\n宝盖沿过道中心收束，覆盖在通道上方。\n顶部边线与东壁铺作交接处较为紧促。",
            record: "过道顶部为丁字盝顶式宝盖，沿过道中心收束，边线与东壁铺作交接处较为紧促。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "L14"
          },
          {
            id: "return_passage_from_canopy",
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道",
            body: "顶部宝盖重新回到过道东壁上方。",
            record: "返回过道。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道",
              body: "过道东壁重新进入视线。",
              closeLabel: "返回"
            }
          }
        ]
      },
      passage_tassel_closeup: {
        id: "passage_tassel_closeup",
        title: "流苏近景",
        image: {
          src: "assets/M1/09_过道/第一号墓过道两壁壁画中的流苏.png",
          alt: "第一号墓过道两壁壁画中的流苏",
          width: 908,
          height: 589
        },
        hotspots: [
          {
            id: "tassel_direction",
            label: "流苏方向",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "流苏方向",
            body: "过道壁画中可见流苏。\n流苏方向略有偏转，线条随悬挂位置下垂。\n偏转与画面构图和悬挂角度相连。",
            record: "过道壁画流苏方向略有偏转，线条随悬挂位置下垂。",
            sourceFile: "M1/09_过道/09_过道-增强线索表-v1.1.md",
            sourceClueId: "H03"
          },
          {
            id: "return_passage_from_tassel",
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回过道",
            body: "流苏细节重新回到壁画整体之中。",
            record: "返回过道。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "passage_main",
              title: "返回过道",
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
            id: "rear_overview_plan_section",
            label: "后室平剖面",
            navLabel: "查看平剖面",
            shape: "rect",
            rect: [0.34, 0.10, 0.66, 0.30],
            title: "后室平剖面",
            body: "后室平剖面图可以先把北壁、南壁、侧壁、顶部和葬具遗存放回同一个空间框架。",
            record: "后室平剖面图用于对照北壁、南壁、侧壁、顶部和葬具遗存的位置关系。",
            sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
            sourceClueId: "HS-E-02",
            viewTransition: {
              targetViewId: "rear_plan_section",
              title: "查看后室平剖面",
              body: "后室平剖面结构图被单独打开。",
              closeLabel: "查看"
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
              lockedBody: "后室观察尚未收束。请回到对应墙面或近景复看线索，并在记录夹中按小面板顺序完成复查、降级与汇总。",
              missingRecords: [
                { id: "analysis:rear_chamber:review_false_door_structure", label: "北壁：复看假门、妇人启门与门缝" },
                { id: "analysis:rear_chamber:review_document_layer", label: "地券近景：复看朱书、行列与位置" },
                { id: "analysis:rear_chamber:review_burial_distribution", label: "葬具证据链：按记录夹小面板依次补齐砖床、人骨、铁钉与地券" },
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
            navLabelCompletedSceneId: "rear_chamber",
            shape: "rect",
            rect: [0.76, 0.60, 0.98, 0.78],
            title: "终章汇总",
            body: "五个章节的阶段判断已经可以并读。\n墓门提供入口结构证据，甬道和过道连接空间与时间，前室展开礼仪秩序，后室收束图像、文书、遗存和日常器物。\n第一版研究判断已经形成：M1 的意义不来自单一异常，而来自空间、图像、文字和遗物之间的多层对应。\n终章结论卡已经在线索墙中生成，可回到记录与结论界面复看主线证据。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              completeOnly: true,
              title: "终章汇总",
              body: "五个章节的阶段判断已经可以并读。\n墓门提供入口结构证据，甬道和过道连接空间与时间，前室展开礼仪秩序，后室收束图像、文书、遗存和日常器物。\n第一版研究判断已经形成：M1 的意义不来自单一异常，而来自空间、图像、文字和遗物之间的多层对应。\n终章结论卡已经在线索墙中生成，可回到记录与结论界面复看主线证据。",
              closeLabel: "知道了",
              lockedBody: "终章汇总还不能查看。请先完成五个章节的组合判断；后室需要在记录夹里完成复查、降级和“汇总后室”。",
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
      rear_plan_section: {
        id: "rear_plan_section",
        title: "第一号墓后室平剖面",
        image: {
          src: "assets/M1/00_墓葬全景与结构图/第一号墓后室平、剖面.png",
          alt: "第一号墓后室平、剖面",
          width: 2304,
          height: 1728
        },
        hotspots: [
          {
            id: "rear_plan_space_relation",
            label: "后室空间关系",
            shape: "rect",
            rect: [0.12, 0.14, 0.88, 0.78],
            title: "后室空间关系",
            body: "平剖面把后室从单面壁画扩展为多壁面空间。\n北壁假门、南壁入口背面、侧壁器物与顶部铺作都可以在这里重新定位。",
            record: "后室平剖面图显示北壁、南壁、侧壁、顶部与葬具遗存的空间关系。",
            sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
            sourceClueId: "HS-E-02"
          },
          {
            id: "return_rear_overview_from_plan",
            label: "返回后室总览",
            navLabel: "返回总览",
            shape: "rect",
            rect: [0, 0.84, 1, 1],
            title: "返回后室入口总览",
            body: "返回后室入口总览。",
            record: "返回后室入口总览。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "rear_overview",
              title: "返回后室总览",
              body: "视角回到后室入口总览。",
              closeLabel: "返回"
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
            body: "后室南壁为进入后室后的入口背面。\n壁面与门道边界相接，图像集中在入口两侧。\n这里同时保留通行边界和壁画陈设。",
            record: "后室南壁位于入口背面，门道边界与壁画陈设并存。",
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
            body: "组合图中左侧为镜台。\n它不再单独代表整面西南壁，而是作为西南壁家具陈设组的一件器物进入对照。",
            record: "组合图中左侧为镜台，与曲足盆架、杌同属后室西南壁家具陈设组。",
            sourceFile: "M1/13_后室_西壁与西南壁/13_后室_西壁与西南壁-热点坐标映射-v1.2.md",
            sourceClueId: "L15-HS-L15-03",
            closeupTransition: {
              targetViewId: "rear_southwest_mirror_closeup",
              title: "靠近观察镜台",
              body: "镜台图像被放大。\n台面、支足和同组家具关系可以继续查看。",
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
              body: "曲足盆架图像被放大。\n弯曲足部和支承结构可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_southwest_stool",
            label: "杌",
            shape: "rect",
            rect: [0.63, 0.22, 0.89, 0.88],
            title: "杌",
            body: "组合图右侧为杌。\n它的低矮尺度需要与镜台、曲足盆架并读，不能单独代表后室西南壁。",
            record: "组合图右侧为杌，应与镜台、曲足盆架并读。",
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
            body: "镜台台面与支足轮廓清楚。\n器物位于后室西南壁家具组合的一侧。",
            record: "镜台台面与支足轮廓清楚，位于西南壁家具组合一侧。",
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
            body: "盆架足部弯曲，支承结构清楚。\n器物轮廓以线条表现，整体较为完整。",
            record: "曲足盆架足部弯曲，支承结构清楚，器物轮廓较完整。",
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
            body: "杌的器身低矮，足部短直。\n器物尺度低于同组镜台与盆架。",
            record: "杌的器身低矮，足部短直，尺度低于同组镜台与盆架。",
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
            body: "后室东北隅上方可见小铺作。\n构件排列较密，位于壁画上部过渡带。\n其节奏与西北壁上部构件可作对照。",
            record: "后室东北隅上方见小铺作，排列较密，位于壁画上部。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L16-HS-L16-03",
            closeupTransition: {
              targetViewId: "rear_northeast_bracket_closeup",
              title: "靠近观察东北隅小铺作",
              body: "东北隅小铺作被放大。\n上部构件的排列和层级可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "rear_northeast_lamp",
            label: "灯菜",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.7],
            title: "后室东北壁灯菜",
            body: "后室东北壁壁画中可见灯菜。\n器物位置靠近壁面一侧，轮廓细长。\n图像保留了照明器具的基本形态。",
            record: "后室东北壁见灯菜，位置靠近壁面一侧，器形细长。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "H04-HS-H04-02",
            closeupTransition: {
              targetViewId: "rear_northeast_lamp_closeup",
              title: "靠近观察灯菜",
              body: "灯菜图像被放大。\n器物轮廓和所在壁面位置可以继续查看。",
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
            title: "后室西北壁颜料层位",
            body: "后室西北壁下部以青绿色调为主。\n青绿颜料层表面可见细密龟裂，边缘有朱红色线迹渗出。\n青绿层与下层白灰、朱红颗粒形成不同层位。",
            record: "后室西北壁青绿颜料层见龟裂，边缘有朱红线迹渗出，下层白灰中夹朱红颗粒。",
            sourceFile: "M1/14_后室_东北壁与西北壁/14_后室_东北壁与西北壁-热点坐标映射-v1.2.md",
            sourceClueId: "L08-HS-L08-04",
            closeupTransition: {
              targetViewId: "rear_northwest_pigment_closeup",
              title: "靠近观察颜料层位",
              body: "西北壁颜料层位被放大。\n青绿层、朱红线迹和白灰底层可以继续查看。",
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
              title: "靠近观察剪刀与熨斗",
              body: "剪刀与熨斗图像被放大。\n刃口、青绿颜料和下层线迹可以继续查看。",
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
              body: "西北壁上层小斗栱被放大。\n构件层级和下方壁画带可以继续查看。",
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
            body: "细腰剪刀与熨斗同处一组图像。\n剪刀刃口处青绿颜料剥落，局部可见较早墨线。",
            record: "细腰剪刀与熨斗同组出现，剪刀刃口处青绿颜料剥落。",
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
            body: "小斗栱彩画位于西北壁上方。\n构件层级清楚，与下方壁画带分开。",
            record: "西北壁上方见小斗栱彩画，构件层级清楚。",
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
            body: "后室北壁中央为假门。\n妇人侧身立于门扇之后，门缝位于假门中央。\n北壁图像与后室砖床空间相对。",
            record: "后室北壁中央为假门，妇人侧身立于门扇之后。",
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
              title: "靠近观察妇人启门",
              body: "妇人启门细部被放大。\n右手、门缘和门缝可以继续查看。",
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
              title: "靠近观察人骨与铁钉",
              body: "人骨与铁钉细部被放大。\n骨骼方向和钉孔分布可以继续查看。",
              closeLabel: "靠近"
            }
          },
          {
            id: "find_distribution",
            label: "出土物分布图",
            shape: "rect",
            rect: [0.62, 0.84, 0.82, 1],
            title: "出土物分布图",
            body: "出土物分布图标出后室内遗物位置。\n人骨、铁钉与砖床边界同时出现。\n图中遗物分布集中在砖床范围内。",
            record: "出土物分布图标出后室内人骨、铁钉与砖床边界。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L04",
            closeupTransition: {
              targetViewId: "rear_distribution_closeup",
              title: "查看出土物分布图",
              body: "出土物分布图被单独显现。\n人骨、铁钉与砖床边界可以继续查看。",
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
            body: "妇人右手扶在门缘处。\n手的位置较低，手指没有平推门扇。\n食指第一截缺失，断口处砖面颜色较周围新。",
            record: "妇人右手扶在门缘处，食指第一截缺失，断口处砖面颜色较周围新。",
            sourceFile: "M1/10_后室_北壁/10_后室_北壁-增强线索表-v1.1.md",
            sourceClueId: "H08"
          },
          {
            id: "door_gap",
            label: "门缝与槽口",
            shape: "rect",
            rect: [0.36, 0.18, 0.82, 0.82],
            title: "门缝与槽口",
            body: "门扇开启缝隙约宽一指。\n门轴槽口实测宽度约三指。\n槽口宽度大于当前门缝。",
            record: "门缝约宽一指，门轴槽口约宽三指。",
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
            body: "地券券文朱书于青砖表面。\n“颍昌府阳翟县某村”字迹清晰。\n行文中县名之后直接接村名。",
            record: "地券券文朱书于青砖表面，县名之后直接接村名。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L03"
          },
          {
            id: "land_deed_lines",
            label: "行列与字数",
            shape: "rect",
            rect: [0.18, 0.56, 0.82, 0.9],
            title: "行列与字数",
            body: "券文共十二行，每行约十五字。\n总字数较常例少二十余字。\n文字行列仍可辨认。",
            record: "券文共十二行，每行约十五字，文字行列仍可辨认。",
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
            label: "人骨方向",
            shape: "rect",
            rect: [0.08, 0.18, 0.62, 0.78],
            title: "人骨方向",
            body: "后室砖床上见四具人骨。\n东侧两具腿骨与砖床长边平行，西侧两具与床沿方向不同。\n骨骼方向并不一致。",
            record: "后室砖床上见四具人骨，骨骼方向并不一致。",
            sourceFile: "M1/16_出土器物与人骨/16_出土器物与人骨-增强线索表-v1.1.md",
            sourceClueId: "L04"
          },
          {
            id: "nail_count",
            label: "铁钉数量",
            shape: "rect",
            rect: [0.48, 0.2, 0.92, 0.82],
            title: "铁钉数量",
            body: "铁钉共八枚，散布于四角附近。\n东北角两枚钉孔相距约两寸，西南角三枚呈三角形排列。\n两处钉孔分布并不相同。",
            record: "铁钉共八枚，钉孔在东北角与西南角呈不同分布。",
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
            body: "北壁中下部的暗缝和地面轴线指向过道方向。\n先转向北壁观察；若入口暂未开放，就回入口总览补齐各壁面线索，再从北壁下方进入过道。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "转向北壁与过道方向",
              body: "前室北壁西部进入视线。\n注意北壁中下部的竖向暗缝：这里是前室通向过道的方向。完成前室汇总后，点击下方“进入过道”。",
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
              body: "前室入口总览重新进入视线。\n从这里整理前室各面，再回北壁下方进入过道。",
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
            body: "案上高瓶立于瓶座之上。\n瓶座下部刻三层莲瓣纹，每层八瓣，瓣尖外卷。\n细量瓶座总高与注子相近，但莲瓣纹雕刻深度达三分，远超砖雕注子的浮雕深度。",
            record: "高瓶立于瓶座之上，瓶座下部刻三层莲瓣纹，每层八瓣；莲瓣纹雕刻深度达三分，远超砖雕注子浮雕深度。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L05",
            closeupTransition: {
              targetViewId: "front_west_bottle_closeup",
              title: "靠近观察高瓶",
              body: "高瓶和瓶座的纹样被单独显现出来。\n瓶座下部的莲瓣纹更清楚。",
              closeLabel: "靠近"
            }
          },
          {
            id: "brick_table",
            label: "砖砌桌侧面",
            shape: "rect",
            rect: [0.44, 0.62, 0.78, 0.86],
            title: "砖砌桌侧面",
            body: "前室西壁下部的砖砌桌、椅与脚床子形成一组家具空间。\n桌面器物却呈现不同的尺度逻辑。\n砖砌桌侧面的三道细槽与器物阴影方向不一致，提示该区可能经历过局部重绘或器物替换式表达。",
            record: "砖砌桌、椅与脚床子形成家具空间；桌面器物呈现不同尺度逻辑，桌侧三道细槽与器物阴影方向不一致。",
            sourceFile: "M1/05_前室_西壁/05_前室_西壁-增强线索表-v1.1.md",
            sourceClueId: "L11",
            closeupTransition: {
              targetViewId: "front_west_table_closeup",
              title: "靠近观察砖砌桌",
              body: "桌侧与转角线条被放大。\n家具结构和桌面器物可以分开观察。",
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
            body: "西壁中间下部的入口图可以补足前室内部与通道之间的关系。\n它适合作为前室空间定位的辅助图，而不是单独解释为器物线索。",
            record: "前室西壁中间下部入口图补充了前室内部与通道之间的空间关系。",
            sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
            sourceClueId: "FRONT-E-01",
            viewTransition: {
              targetViewId: "front_west_entry_closeup",
              title: "查看前室入口关系",
              body: "前室入口关系图被单独打开。",
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
            body: "前室顶部的补间铺作进入视线。\n构件位于壁面与墓顶的过渡处。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室顶部的补间铺作进入视线。",
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
            body: "这张图把前室入口放回西壁下部，能帮助玩家确认前室不是孤立房间，而是连接甬道、过道的中段空间。",
            record: "前室入口关系图显示前室与甬道、过道之间的中段空间关系。",
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
              body: "前室入口总览重新进入视线。\n从这里整理前室各面，再回北壁下方进入过道。",
              closeLabel: "返回"
            }
          },
          {
            id: "female_musicians",
            label: "女乐图像",
            shape: "rect",
            rect: [0.14, 0.18, 0.76, 0.82],
            title: "女乐图像",
            body: "细节特写中，女乐莲花冠、排箫、骨朵与甬道酒瓶分别指向服饰、音乐、仪仗和宴饮。\n四类物象分布在前室、甬道和南壁。\n它们构成从迎引、奏乐到通行的礼仪序列。",
            record: "女乐莲花冠、排箫、骨朵与甬道酒瓶分别指向服饰、音乐、仪仗和宴饮，构成从迎引、奏乐到通行的礼仪序列。",
            sourceFile: "M1/04_前室_东壁/04_前室_东壁-增强线索表-v1.1.md",
            sourceClueId: "L18"
          },
          {
            id: "east_wall_surface",
            label: "东壁画面",
            shape: "rect",
            rect: [0.2, 0.08, 0.9, 0.26],
            title: "东壁画面",
            body: "前室壁画被手电照射后，白灰层表面温度似乎短暂低于周围。\n壁面色层保存不均。\n局部线条仍然连续。",
            record: "前室壁画被手电照射后，白灰层表面温度似乎短暂低于周围。",
            sourceFile: "M1/04_前室_东壁/04_前室_东壁-增强线索表-v1.1.md",
            sourceClueId: "H07"
          },
          {
            id: "pointed_shoes",
            label: "女乐尖鞋",
            shape: "rect",
            rect: [0.18, 0.66, 0.58, 0.96],
            title: "女乐尖鞋",
            body: "女乐尖鞋形制醒目。\n鞋尖轮廓突出，位于衣裙下缘。\n尖鞋与莲花冠、排箫同属人物服饰与器物细节。",
            record: "女乐尖鞋形制醒目，鞋尖轮廓突出，位于衣裙下缘。",
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
            body: "前室顶部的补间铺作进入视线。\n构件位于壁面与墓顶的过渡处。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室顶部的补间铺作进入视线。",
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
            body: "东壁人物已经记录。\n器物线索仍需回到西壁对照。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁器物重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
              body: "前室入口总览重新进入视线。\n从这里整理前室各面，再回北壁下方进入过道。",
              closeLabel: "返回"
            }
          },
          {
            id: "south_wall_overview",
            label: "南壁整体",
            shape: "rect",
            rect: [0.14, 0.16, 0.86, 0.84],
            title: "前室南壁",
            body: "前室南壁东西两侧壁函分列于入口附近。\n倚柱彩画作为竖向分隔，壁函与倚柱之间的距离并不完全相同。\n南壁下部底线较平，壁函上沿略向西侧抬高。",
            record: "前室南壁壁函分列入口附近；下部底线较平，壁函上沿略向西侧抬高。",
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
            body: "倚柱彩画位于南壁竖向分隔处。\n彩画边缘与两侧壁函外框相邻。\n底部线条较平，上部对应关系出现轻微偏移。",
            record: "倚柱彩画与两侧壁函相邻；底部较平，上部对应关系有偏移。",
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
            body: "前室顶部的补间铺作进入视线。\n构件位于壁面与墓顶的过渡处。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室顶部的补间铺作进入视线。",
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
            body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "前室北壁西部壁画内容较密。\n人物与画面重心集中在一侧，靠近通向内侧空间的方向。\n线条虽有残损，仍可辨认出较强的画面组织。",
            record: "北壁西部壁画内容较密，画面重心偏向内侧入口方向。",
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
            body: "这是前室北壁下方通向过道的方向。\n若入口暂未开放，请先点“返回入口总览”，继续补齐前室各壁面和顶部线索。",
            record: "前室北壁下方确认了通向过道的方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              targetViewId: "passage_overview",
              completesSceneId: "front_chamber",
              title: "进入过道轴线",
              body: "前室四壁与顶部已经形成对应。\n你从北壁下方的暗缝方向进入过道。关闭弹窗后，狭长的过道轴线会重新进入视线。",
              closeLabel: "进入",
              lockedBody: "过道入口还不能通过。请先点“返回入口总览”，回到前室总览后补齐各壁面线索，并在记录夹中完成三条复查、两条降级和前室汇总。",
              missingRecords: [
                { id: "analysis:front_chamber:review_artifact_tension", label: "西壁：复看注子、高瓶与砖砌桌" },
                { id: "analysis:front_chamber:review_ritual_sequence", label: "东壁/北壁：复看女乐与两段画面" },
                { id: "analysis:front_chamber:review_partition_structure", label: "南壁/顶部：复看壁函、倚柱与铺作" },
                { excludedId: "front_chamber:pointed_shoes", label: "东壁尖鞋：在记录夹中降级为服饰细节" },
                { excludedId: "front_chamber:east_wall_surface", label: "东壁温差：在记录夹中降级为体感异常" },
                { id: "analysis:front_chamber:combo", label: "记录夹：形成前室组合判断，再回北壁下方点击“进入过道”" }
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
            body: "前室顶部的补间铺作进入视线。\n构件位于壁面与墓顶的过渡处。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室顶部的补间铺作进入视线。",
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
            body: "回到前室入口总览。\n如果过道入口暂未解锁，先从总览补看各壁面和顶部；完成记录夹汇总后，再回北壁下方进入过道。",
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
            body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "南壁的壁函与倚柱重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "南壁的壁函与倚柱重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "前室北壁东部画面较疏。\n壁面结构和局部人物痕迹仍可辨认，整体留白多于西部。\n东西两段并置时，画面密度并不均衡。",
            record: "北壁东部画面较疏，留白多于西部。",
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
            body: "这是前室北壁下方通向过道的方向。\n若入口暂未开放，请先点“返回入口总览”，继续补齐前室各壁面和顶部线索。",
            record: "前室北壁下方确认了通向过道的方向。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              targetViewId: "passage_overview",
              completesSceneId: "front_chamber",
              title: "进入过道轴线",
              body: "前室四壁与顶部已经形成对应。\n你从北壁下方的暗缝方向进入过道。关闭弹窗后，狭长的过道轴线会重新进入视线。",
              closeLabel: "进入",
              lockedBody: "过道入口还不能通过。请先点“返回入口总览”，回到前室总览后补齐各壁面线索，并在记录夹中完成三条复查、两条降级和前室汇总。",
              missingRecords: [
                { id: "analysis:front_chamber:review_artifact_tension", label: "西壁：复看注子、高瓶与砖砌桌" },
                { id: "analysis:front_chamber:review_ritual_sequence", label: "东壁/北壁：复看女乐与两段画面" },
                { id: "analysis:front_chamber:review_partition_structure", label: "南壁/顶部：复看壁函、倚柱与铺作" },
                { excludedId: "front_chamber:pointed_shoes", label: "东壁尖鞋：在记录夹中降级为服饰细节" },
                { excludedId: "front_chamber:east_wall_surface", label: "东壁温差：在记录夹中降级为体感异常" },
                { id: "analysis:front_chamber:combo", label: "记录夹：形成前室组合判断，再回北壁下方点击“进入过道”" }
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
            body: "前室顶部的补间铺作进入视线。\n构件位于壁面与墓顶的过渡处。",
            record: "前室顶部可继续观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "抬头看顶部",
              body: "前室顶部的补间铺作进入视线。",
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
            body: "回到前室入口总览。\n如果过道入口暂未解锁，先从总览补看各壁面和顶部；完成记录夹汇总后，再回北壁下方进入过道。",
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
            body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "南壁的壁函与倚柱重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "南壁的壁函与倚柱重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
              closeLabel: "转向"
            }
          }
        ]
      },
      front_ceiling: {
        id: "front_ceiling",
        title: "第一号墓前室顶部",
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
            rect: [0.2, 0.08, 0.8, 0.42],
            title: "补间铺作",
            body: "前室顶部补间铺作位于壁面与墓顶过渡处。\n构件层级清楚，斗口宽度较大。\n出跳部分向外伸出，与壁面上缘相接。",
            record: "前室顶部补间铺作位于壁面与墓顶过渡处，构件层级清楚。",
            sourceFile: "M1/08_前室_顶部隅角及其他/08_前室_顶部隅角及其他-增强线索表-v1.1.md",
            sourceClueId: "L13"
          },
          {
            id: "northwest_corner",
            label: "西北角构件",
            shape: "rect",
            rect: [0.56, 0.2, 0.94, 0.82],
            title: "西北角构件",
            body: "西北角转角构件较为紧凑。\n与补间铺作相比，斗口宽度较小。\n两处出跳距离接近，但构件宽度不同。",
            record: "西北角转角构件较紧凑，斗口宽度小于补间铺作。",
            sourceFile: "M1/08_前室_顶部隅角及其他/08_前室_顶部隅角及其他-增强线索表-v1.1.md",
            sourceClueId: "L13",
            closeupTransition: {
              targetViewId: "front_ceiling_northwest_closeup",
              title: "靠近观察西北角",
              body: "西北角转角构件被放大。\n构件宽度和出跳位置可以继续查看。",
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
              body: "前室入口总览重新进入视线。\n从这里整理前室各面，再回北壁下方进入过道。",
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
            body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "转向西壁",
              body: "西壁的器物与家具重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "转向东壁",
              body: "东壁的人物图像重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
            body: "南壁的壁函与倚柱重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "转向南壁",
              body: "南壁的壁函与倚柱重新进入视线。\n需要回到空间锚点时，可点击“返回入口总览”。",
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
        title: "西北角近景",
        image: {
          src: "assets/M1/08_前室_顶部隅角及其他/第一号墓西北角.png",
          alt: "第一号墓西北角",
          width: 1920,
          height: 1849
        },
        hotspots: [
          {
            id: "corner_bracket",
            label: "转角构件",
            shape: "rect",
            rect: [0.28, 0.2, 0.78, 0.78],
            title: "转角构件",
            body: "西北角转角构件较为紧凑。\n斗口宽度小于补间铺作。\n出跳距离与补间铺作近似相同。",
            record: "西北角转角构件较紧凑，斗口宽度较小，出跳距离与补间铺作近似相同。",
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
            body: "西北角构件细部已经记录。\n补间铺作重新进入视线。",
            record: "完成西北角近景观察。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_ceiling",
              title: "返回顶部",
              body: "补间铺作重新进入视线。",
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
            label: "倚柱边缘",
            shape: "rect",
            rect: [0.28, 0.24, 0.72, 0.72],
            title: "倚柱彩画边缘",
            body: "倚柱彩画位于南壁竖向分隔处。\n彩画边缘与两侧壁函外框相邻。\n底部线条较平，上部对应关系出现轻微偏移。",
            record: "倚柱彩画位于南壁竖向分隔处，边缘与两侧壁函外框相邻。",
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
            body: "砖砌桌面侧面露出三道平行细槽。\n槽内积灰更厚。\n桌侧三道细槽积灰较厚，像早于表层绘制。",
            record: "砖砌桌侧面露出三道平行细槽，槽内积灰更厚，像早于表层绘制。",
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
            label: "注子接缝",
            shape: "rect",
            rect: [0.2, 0.48, 0.72, 0.82],
            title: "注子接缝",
            body: "注子砖雕与壁面砖缝对齐。\n边缘贴合壁面，周围白灰层较稳定。\n接缝处未见明显错位。",
            record: "注子砖雕与壁面砖缝对齐，边缘贴合壁面，周围白灰层较稳定。",
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
  tomb_gate_back_corridor: "墓门 / 后部与甬道关系",
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
      body: "这张图用于补足墓外环境的尺度。\n后续美工可在这里标注村落、墓群范围和进入第一号墓的方向。",
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
  label: "墓门结构图",
  navLabel: "结构图",
  shape: "rect",
  rect: [0.62, 0.12, 0.94, 0.42],
  title: "墓门结构复原图",
  body: "墓门复原图能帮助玩家理解门额、门框、封门砖和门洞的组成关系。",
  record: "墓门结构复原图用于对照门额、门框、封门砖和门洞的组成关系。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
  sourceClueId: "GATE-P1-01",
  viewTransition: {
    targetViewId: "tomb_gate_structure_diagram",
    title: "查看墓门结构图",
    body: "墓门结构复原图被单独打开。",
    closeLabel: "查看"
  }
});

addSceneHotspot("tomb_gate", "tomb_gate_main", {
  id: "gate_back_corridor_link",
  label: "门后与甬道",
  navLabel: "门后关系",
  shape: "rect",
  rect: [0.62, 0.44, 0.94, 0.78],
  title: "墓门后部与甬道关系",
  body: "这张图把墓门后部和甬道东壁放在同一张图里，适合做墓门到甬道的空间过渡。",
  record: "墓门后部与甬道东壁图补充了墓门到甬道的空间过渡。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
  sourceClueId: "GATE-P1-02",
  viewTransition: {
    targetViewId: "tomb_gate_back_corridor",
    title: "查看门后与甬道",
    body: "墓门后部与甬道关系图被单独打开。",
    closeLabel: "查看"
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

addSceneView("tomb_gate", "tomb_gate_back_corridor", {
  id: "tomb_gate_back_corridor",
  title: "墓门后部与甬道东壁",
  image: {
    src: "assets/M1/02墓道与墓门/Ⅱ 第一号墓墓门后部、甬道东壁.png",
    alt: "第一号墓墓门后部、甬道东壁",
    width: 3520,
    height: 4693
  },
  hotspots: [
    {
      id: "gate_back_corridor_relation",
      label: "门后通道关系",
      shape: "rect",
      rect: [0.16, 0.12, 0.84, 0.82],
      title: "门后通道关系",
      body: "门后与甬道东壁同图出现，可以让墓门章节和甬道章节的过渡更连续。",
      record: "门后与甬道东壁同图出现，补充墓门到甬道的连续空间关系。",
      sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1墓门线索精修版_v1.0.md",
      sourceClueId: "GATE-P1-02"
    },
    {
      id: "return_tomb_gate_from_back_corridor",
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

addSceneHotspot("corridor", "corridor_west_wall", {
  id: "west_wall_wine_bottle",
  label: "酒瓶细节",
  navLabel: "酒瓶",
  shape: "rect",
  rect: [0.18, 0.54, 0.52, 0.90],
  title: "甬道西壁酒瓶",
  body: "甬道西壁酒瓶适合作为礼仪与宴饮物象的补充细节，不能单独解释为异常。",
  record: "甬道西壁酒瓶可作为礼仪与宴饮物象的补充细节。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1甬道线索精修版_v1.0.md",
  sourceClueId: "COR-P1-02",
  detailImage: {
    src: "assets/M1/17_其他细节与特写/第一号墓甬道西壁壁画中的酒瓶.png",
    alt: "第一号墓甬道西壁壁画中的酒瓶",
    caption: "局部放大图：酒瓶尺寸较小，作为甬道西壁的补充细节显示，不再作为整屏背景。"
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
  body: "排箫是前室东壁女乐图像的音乐物象，可与服饰和仪仗细节并读。",
  record: "女乐排箫是前室东壁音乐物象，可与服饰和仪仗细节并读。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
  sourceClueId: "FRONT-P1-01",
  detailImage: {
    src: "assets/M1/17_其他细节与特写/第一号墓前室东壁壁画中女乐所执的排箫.png",
    alt: "第一号墓前室东壁壁画中女乐所执的排箫",
    caption: "局部放大图：排箫作为女乐音乐物象显示，后续可做描线增强或组合到女乐细节组。"
  }
});

addSceneHotspot("front_chamber", "front_south", {
  id: "mace_detail",
  label: "骨朵",
  navLabel: "骨朵",
  shape: "rect",
  rect: [0.42, 0.16, 0.62, 0.78],
  title: "前室南壁骨朵",
  body: "骨朵图像可作为前室南壁仪仗细节，用来补充前室的礼仪序列。",
  record: "前室南壁骨朵可作为仪仗细节，补充前室礼仪序列。",
  sourceFile: "docs/handoff/线索交付文档/02_章节精修交付/M1前室线索精修版_v1.0.md",
  sourceClueId: "FRONT-P1-02",
  detailImage: {
    src: "assets/M1/17_其他细节与特写/第一号墓前室南壁壁画中的骨朵.png",
    alt: "第一号墓前室南壁壁画中的骨朵",
    caption: "局部放大图：骨朵为极窄竖图，作为仪仗细节浮窗显示，不再作为整屏背景。"
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
      body: "莲花冠适合做人物服饰细节的局部放大，可与东壁女乐总图对应。",
      record: "莲花冠近景可与东壁女乐总图对应，补充人物服饰细节。",
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
  label: "地券并盖",
  navLabel: "地券并盖",
  shape: "rect",
  rect: [0.62, 0.12, 0.92, 0.50],
  title: "地券并盖",
  body: "地券并盖图可以补足地券从文字近景到出土实物的关系。",
  record: "地券并盖图补充了地券文字近景与出土实物之间的关系。",
  sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
  sourceClueId: "HS-P0-03",
  viewTransition: {
    targetViewId: "rear_land_deed_cover_closeup",
    title: "查看地券并盖",
    body: "地券并盖图被单独打开。",
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
      body: "假门上方和两侧以砖砌边框限定出门的范围。\n这部分更像图像化、装饰化的门框线索，不能直接推出真实通道。",
      record: "假门上方和两侧以砖砌边框限定门的范围，应作为图像化门框复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "false_door_left_leaf",
      label: "左侧门扇",
      shape: "rect",
      rect: [0.25, 0.26, 0.44, 0.86],
      title: "左侧门扇纹样",
      body: "左侧门扇保留了完整的纹样和边框。\n它和北壁妇人启门图像互相印证：重点是门的母题，而不是可进入的真实门洞。",
      record: "左侧门扇纹样完整，可与妇人启门图像共同确认假门母题。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05"
    },
    {
      id: "false_door_open_gap",
      label: "门缝暗部",
      shape: "rect",
      rect: [0.44, 0.25, 0.62, 0.86],
      title: "门缝与暗部",
      body: "门缝和暗部会制造空间延续的感觉。\n复查时应把它收束为图像中的空间暗示，不能解释成密室、机关或真实通道。",
      record: "门缝暗部制造空间延续感，但应收束为图像暗示，不能推出真实通道。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "false_door_open_leaf",
      label: "开启门扇",
      shape: "rect",
      rect: [0.61, 0.27, 0.72, 0.84],
      title: "开启状门扇",
      body: "右侧门扇被画成打开的状态。\n这一姿态需要和妇人启门近景对读，说明后室北壁被塑造成有门后空间想象的图像。",
      record: "右侧门扇呈开启状，应与妇人启门近景对读。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05",
      viewTransition: {
        targetViewId: "rear_woman_closeup",
        title: "对照妇人启门",
        body: "妇人启门近景被打开，用来对照门扇与手部关系。",
        closeLabel: "对照"
      }
    },
    {
      id: "false_door_threshold",
      label: "门槛下沿",
      shape: "rect",
      rect: [0.19, 0.82, 0.68, 0.94],
      title: "门槛与下沿",
      body: "假门下沿把门的图像边界收束到北壁画面中。\n它有助于确认门是壁面构图的一部分，而不是从砖床下方继续打开的空间。",
      record: "假门下沿把门的图像边界收束在北壁画面中。",
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
      body: "妇人位于两扇门之间，位置被压在门缝和门框中。\n这能说明妇人启门与假门是一组图像，而不是孤立人物。",
      record: "妇人位于两扇门之间，说明妇人启门与假门是一组图像。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-05"
    },
    {
      id: "north_lower_closed_leaf",
      label: "右侧门扇",
      shape: "rect",
      rect: [0.49, 0.31, 0.70, 0.78],
      title: "右侧闭合门扇",
      body: "右侧门扇更像壁面上的图像构件。\n它和开启门扇共同制造门后空间的想象，但不能推出真实通道。",
      record: "右侧闭合门扇与开启门扇共同制造空间想象，不能推出真实通道。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-H-03"
    },
    {
      id: "north_lower_threshold",
      label: "门槛下沿",
      shape: "rect",
      rect: [0.23, 0.72, 0.74, 0.86],
      title: "门槛与下沿",
      body: "门槛下沿把假门图像收束到北壁下部。\n它是从假门图像过渡到砖床/下部空间的关键边界。",
      record: "门槛下沿是从假门图像过渡到砖床下部空间的关键边界。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-P0-01"
    },
    {
      id: "north_lower_bed_boundary",
      label: "砖床边界",
      shape: "rect",
      rect: [0.20, 0.84, 0.82, 0.98],
      title: "砖床与下部边界",
      body: "画面下方的砖面边界提示北壁下部与砖床区域相接。\n后续人骨、铁钉和地券都需要回到这个边界关系中复查。",
      record: "北壁下方砖面边界提示砖床区域，人骨、铁钉和地券需回到这一边界关系中复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-01"
    },
    {
      id: "north_lower_bed_axis",
      label: "假门-砖床轴线",
      shape: "rect",
      rect: [0.34, 0.70, 0.66, 0.96],
      title: "假门下沿与砖床轴线",
      body: "假门下沿与砖床边界在同一条垂直关系上被看见。\n这一热点用于把图像层的假门和遗存层的砖床分开记录，再在复查时重新叠合。",
      record: "假门下沿与砖床边界形成可复查的轴线关系，应先分层记录再叠合判断。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
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
      body: "东南壁左侧人物与中央场景相连，补足后室侧壁叙事。\n这一组不能脱离整面东南壁单独解释。",
      record: "东南壁左侧人物组补足后室侧壁叙事，应与整面东南壁一起复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_table_group",
      label: "桌案与器物",
      shape: "rect",
      rect: [0.30, 0.42, 0.57, 0.72],
      title: "桌案与器物组",
      body: "桌案与器物位于东南壁画面的核心区域。\n点击后进入细部图，用来核对人物、桌面和器物之间的关系。",
      record: "东南壁桌案与器物组位于画面核心，应进入细部图复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02",
      viewTransition: {
        targetViewId: "rear_southeast_detail",
        title: "查看东南壁细部",
        body: "后室东南壁细部被单独打开。",
        closeLabel: "查看"
      }
    },
    {
      id: "rear_southeast_right_bearer",
      label: "右侧承盘人物",
      shape: "rect",
      rect: [0.59, 0.30, 0.84, 0.86],
      title: "右侧承盘人物",
      body: "右侧人物持盘，与中央桌案形成同一组图像关系。\n它适合用于说明东南壁是后室多壁面复查的一部分，而不是新的异常证据。",
      record: "右侧承盘人物与中央桌案形成同一组图像关系。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_wall_edge",
      label: "壁面边界",
      shape: "rect",
      rect: [0.82, 0.10, 0.98, 0.86],
      title: "右侧壁面边界",
      body: "右侧边界保留了壁面分隔和装饰线。\n这个边界帮助玩家把东南壁放回后室多壁面结构中，而不是只看人物局部。",
      record: "东南壁右侧边界帮助确认该图属于后室多壁面结构。",
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
      body: "细部图左侧人物被放大后，能看清它与桌案的邻接关系。\n它仍属于东南壁整体图像，不单独生成新的主线判断。",
      record: "东南壁细部左侧人物应与桌案和整体壁面一起复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_detail_table",
      label: "桌面器物",
      shape: "rect",
      rect: [0.20, 0.54, 0.55, 0.86],
      title: "桌面器物",
      body: "桌面器物处在人物之间，是东南壁细部中最适合复查的对象区。\n它用于强化多壁面观察，不应被解释成单独的异常物证。",
      record: "东南壁细部桌面器物用于强化多壁面观察。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_detail_middle_figure",
      label: "中部人物",
      shape: "rect",
      rect: [0.55, 0.30, 0.72, 0.78],
      title: "中部人物",
      body: "中部人物连接左侧桌案和右侧承盘人物。\n它使东南壁细部保持连续叙事，而不是断裂的单点图像。",
      record: "东南壁细部中部人物连接桌案和承盘人物，保持图像连续。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-E-02"
    },
    {
      id: "rear_southeast_detail_right_tray",
      label: "右侧承盘",
      shape: "rect",
      rect: [0.70, 0.45, 0.98, 0.90],
      title: "右侧承盘与人物",
      body: "右侧承盘与人物在细部图中更清楚。\n这组信息用于确认东南壁的宴饮/侍奉图像关系，仍归入后室多壁面复查。",
      record: "右侧承盘与人物用于确认东南壁的图像关系，归入后室多壁面复查。",
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
      body: "中央砖面是地券本体，朱书文字区仍是这组文书器物的核心。\n它需要与单张地券近景对读，避免只看形制而忽略文字线索。",
      record: "地券并盖图中的中央砖面为地券本体，应与单张地券近景对读。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-04",
      viewTransition: {
        targetViewId: "rear_land_deed_closeup",
        title: "对照地券文字",
        body: "地券近景被打开，用来复查朱书文字与砖面边界。",
        closeLabel: "对照"
      }
    },
    {
      id: "land_deed_cover_top_lid",
      label: "上方券盖",
      shape: "rect",
      rect: [0.39, 0.07, 0.76, 0.25],
      title: "上方券盖",
      body: "上方券盖显示这不是孤立的一块文字砖，而是地券与盖组成的一套文书器物。\n这一点可帮助把地券从普通砖块中区分出来。",
      record: "上方券盖显示地券与盖组成一套文书器物。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-04"
    },
    {
      id: "land_deed_side_profile",
      label: "侧视结构",
      shape: "rect",
      rect: [0.12, 0.07, 0.29, 0.72],
      title: "券盖侧视结构",
      body: "左侧侧视图说明券盖具有厚度和罩覆关系。\n它补充地券与盖的组合方式，但不能被解释成额外机关或隐藏结构。",
      record: "券盖侧视图说明其厚度和罩覆关系，不能解释成额外机关。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-04"
    },
    {
      id: "land_deed_lower_lid",
      label: "下方券盖",
      shape: "rect",
      rect: [0.34, 0.82, 0.74, 0.97],
      title: "下方券盖",
      body: "下方券盖与上方券盖形成形制对照。\n它帮助玩家理解地券并盖是一组出土实物，而不是单张图像的装饰背景。",
      record: "下方券盖与上方券盖形成形制对照，说明地券并盖是一组出土实物。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-04"
    },
    {
      id: "land_deed_scale_bar",
      label: "比例标尺",
      shape: "rect",
      rect: [0.10, 0.80, 0.34, 0.92],
      title: "比例标尺",
      body: "比例标尺用于提示图像是记录性图版。\n尺寸关系可以辅助复查，但不承担单独的剧情推理功能。",
      record: "比例标尺提示该图为记录性图版，只用于辅助尺寸复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室图片热点线索流程映射表_v1.0.md",
      sourceClueId: "HS-P0-04"
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
      body: "白瓷碗主体残片显示器物已经破碎。\n它可以作为后室出土器物层的一部分，不应单独承担异常判断。",
      record: "白瓷碗主体残片显示器物已破碎，应作为后室出土器物层的一部分。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_rim_shards",
      label: "口沿残片",
      shape: "rect",
      rect: [0.35, 0.13, 0.66, 0.40],
      title: "口沿与上部残片",
      body: "上方残片保留了口沿弧线。\n这有助于确认它是器物残片，而不是文字、符号或特殊标记。",
      record: "上方残片保留口沿弧线，可确认其为器物残片。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_lower_shards",
      label: "下部残片",
      shape: "rect",
      rect: [0.20, 0.58, 0.62, 0.90],
      title: "下部散落残片",
      body: "下部残片与主体碗体分离，说明出土状态并不完整。\n这类破碎状态更适合归入随葬器物保存状况，而不是单独推成事件线索。",
      record: "下部散落残片说明白瓷碗出土状态不完整，应归入随葬器物保存状况。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_excavation_context",
      label: "出土背景",
      shape: "rect",
      rect: [0.56, 0.25, 0.98, 0.84],
      title: "出土背景与残留痕迹",
      body: "右侧背景保留出土记录和壁面残留的感觉。\n它提醒玩家：白瓷碗需要回到砖床、人骨、铁钉和地券的空间关系里，而不是单独解释。",
      record: "白瓷碗出土背景提醒该器物需回到砖床、人骨、铁钉和地券的空间关系中复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P1-05"
    },
    {
      id: "porcelain_bowl_no_text_signal",
      label: "无文字信号",
      shape: "rect",
      rect: [0.12, 0.20, 0.70, 0.72],
      title: "白瓷碗表面无明确文字信号",
      body: "这张近景中可见器物残片和口沿弧线，但没有可读文字、刻款或明确标识。\n因此白瓷碗应先归入随葬器物和保存状态，不单独承担身份暗号或特殊信号。",
      record: "白瓷碗近景未见明确文字、刻款或标识，应先归入随葬器物和保存状态。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-H-01"
    },
    {
      id: "porcelain_bowl_context_relation",
      label: "位置复查",
      shape: "rect",
      rect: [0.54, 0.54, 0.94, 0.92],
      title: "白瓷碗与砖床遗存关系",
      body: "白瓷碗的位置需要回到出土物分布图中复查。\n它可以补充后室器物层，但不能替代砖床、人骨、铁钉和地券构成的葬具主链。",
      record: "白瓷碗位置需回到出土物分布图复查，可补充器物层但不能替代葬具主链。",
      sourceFile: "docs/handoff/线索交付文档/01_核心交付/M1线索总表_PRD适配版_v1.0.md",
      sourceClueId: "HS-H-01"
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
      body: "图中的标记把人骨放回葬具范围内观察。\n这里的重点是范围叠合，而不是把骨骼姿态直接解释成扰动事件。",
      record: "人骨位置图应先用于确认葬具范围与骨骼分布的叠合关系。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-02"
    },
    {
      id: "bones_position_skull_end",
      label: "头骨端",
      shape: "rect",
      rect: [0.08, 0.10, 0.27, 0.34],
      title: "头骨端",
      body: "头骨端可以帮助判断人骨在葬具中的朝向。\n它只能说明相对位置，不能直接推出死因、身份或迁葬判断。",
      record: "头骨端用于判断人骨相对朝向，不能直接推出死因、身份或迁葬。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-02"
    },
    {
      id: "bones_position_limb_cluster",
      label: "肢骨集中区",
      shape: "rect",
      rect: [0.28, 0.17, 0.77, 0.48],
      title: "肢骨集中区",
      body: "肢骨集中区显示骨骼并非铺满整个后室。\n这一信息需要和铁钉范围、砖床边界一起看，不能独立解释为异常移动。",
      record: "肢骨集中区显示骨骼没有铺满整个后室，应与铁钉范围、砖床边界一起复查。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-02"
    },
    {
      id: "bones_position_trace_left",
      label: "左下痕迹区",
      shape: "rect",
      rect: [0.07, 0.50, 0.31, 0.72],
      title: "左下葬具痕迹",
      body: "左下方残留痕迹可作为葬具范围复查的一部分。\n它应与人骨集中区分开记录，避免把所有痕迹都等同于骨骼边界。",
      record: "左下方残留痕迹应与人骨集中区分开记录，用于复查葬具范围。",
      sourceFile: "docs/handoff/线索交付文档/03_后室专项交付/M1后室线索表_正式交付版_v1.0.md",
      sourceClueId: "HS-P0-03"
    },
    {
      id: "bones_position_trace_right",
      label: "右下痕迹区",
      shape: "rect",
      rect: [0.68, 0.52, 0.94, 0.72],
      title: "右下葬具痕迹",
      body: "右下方残留痕迹与左下方痕迹共同提示葬具范围。\n它帮助把判断收束到葬具复原，而不是盗扰或人为破坏。",
      record: "右下方残留痕迹提示葬具范围，帮助把判断收束到葬具复原。",
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
          metText: "封门方式已经复查，石英砂灰缝已被降级为待排除的单点异常。",
          missingText: "还缺封门方式复查。需要先把砖缝与地面交界一起复看，才知道哪些异常只是砌筑痕迹。 "
        },
        {
          id: "analysis:tomb_gate:combo",
          label: "墓门组合判断",
          metText: "墓门章节已经完成观察、复查和组合，可进入主线结论。",
          missingText: "还缺墓门组合判断。单条观察还不能生成结论卡，需先在记录夹里完成复查与组合。 "
        }
      ],
      relations: ["R01", "R08"]
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
          missingText: "还缺通道导向复查。甬道不能只看顶部，还要把中段和两壁方向一起纳入。 "
        },
        {
          id: "analysis:corridor:combo",
          label: "甬道组合判断",
          metText: "甬道章节已经完成观察、复查和组合，可进入主线结论。",
          missingText: "还缺甬道组合判断。当前仍是单条观察，需先在记录夹里完成复查与组合。 "
        }
      ],
      relations: ["R03", "R07"]
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
          missingText: "还缺礼仪动线复查。前室不能只看器物，必须把人物与空间引导一起判断。 "
        },
        {
          id: "analysis:front_chamber:review_partition_structure",
          label: "入口分区与顶部结构复查",
          metText: "入口分区与顶部结构复查已完成，可确认前室不是平铺画面，而是被明确分区的礼仪空间。",
          missingText: "还缺入口分区与顶部结构复查。需要把南壁壁函、倚柱与顶部铺作一起复看。 "
        },
        {
          excludedId: "front_chamber:pointed_shoes",
          label: "尖鞋误导已排除",
          metText: "尖鞋已被降级，单一服饰细节不会再直接支撑前室主线。",
          missingText: "还缺尖鞋误导排除。单独鞋型还不能直接推成身份或年代判断。 "
        },
        {
          excludedId: "front_chamber:east_wall_surface",
          label: "东壁温差误导已排除",
          metText: "东壁温差已被降级，单次手电照射下的体感差异不会直接进入主线判断。",
          missingText: "还缺东壁温差误导排除。手电照射后的局部体感差异还不能直接当作异常主证。 "
        },
        {
          id: "analysis:front_chamber:combo",
          label: "前室组合判断",
          metText: "前室章节已经完成观察、复查、排除与组合，可进入主线结论。",
          missingText: "还缺前室组合判断。当前仍是分散观察，需先完成复查并排除误导线索。 "
        }
      ],
      relations: ["R01", "R05"]
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
          missingText: "还缺窗棂与宝盖复查。过道不能只看题记，还要把棂窗和顶部结构一起判断。 "
        },
        {
          id: "analysis:passage:combo",
          label: "过道组合判断",
          metText: "过道章节已经完成观察、复查和组合，可进入主线结论。",
          missingText: "还缺过道组合判断。需先在记录夹里完成复查、排除和组合，结论卡才会生成。 "
        }
      ],
      relations: ["R03", "R04"]
    },
    {
      id: "rear_chamber",
      sceneId: "rear_chamber",
      chapter: "后室",
      title: "后室结论卡",
      summary: "后室第一版先把假门图像、地券文书和砖床遗存压进同一条证据链，确认图像与遗存如何互相解释。",
      conclusion: "后室第一版的核心不是单条奇异细节，而是假门图像、地券和砖床遗存共同指向一组需要谨慎辨别的葬仪与身份证据。",
      generationPrompt: {
        title: "新结论卡已生成：后室",
        body: "后室第一版的图像、文书和遗存已经可以并读。现在可以在线索墙查看后室如何形成第一组核心判断。 "
      },
      completionSummary: {
        title: "后室阶段完成",
        body: "后室第一版已经完成从假门到砖床遗存的收束。下一步可以进入终章，或继续补强后室第二版的日常器物线。 "
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
          label: "妇人手部新断口已排除",
          metText: "妇人手部新断口已被降级，不再直接推动后室主线。",
          missingText: "还缺妇人手部新断口排除。单一点位的新旧差异还不能直接上升为主线判断。 "
        },
        {
          excludedId: "rear_chamber:nail_count",
          label: "铁钉数量异常已排除",
          metText: "铁钉数量异常已被降级，单点数量差不会替代整体分布关系。",
          missingText: "还缺铁钉数量异常排除。单独角点数量差还不能直接推出后室主结论。 "
        },
        {
          id: "analysis:rear_chamber:combo",
          label: "后室组合判断",
          metText: "后室第一版已经完成观察、复查、排除与组合，可进入主线结论。",
          missingText: "还缺后室组合判断。当前仍是分散观察，需先完成复查并排除误导线索。 "
        }
      ],
      relations: ["R02", "R04", "R07"]
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
        body: "现阶段的主干证据已经足以形成第一版研究判断。接下来应继续补强分析流程与证据复查，而不是盲目增加散点热区。 "
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
      title: "前室重绘",
      summary: "用当前运行版已落地的墓门、前室器物和顶部证据，建立前室装饰调整的简化链。",
      requirements: [
        { id: "tomb_gate:lintel_back", label: "门额背面彩画" },
        { anyOf: ["front_chamber:ewer", "front_chamber:high_bottle"], label: "前室器物年代矛盾" },
        { anyOf: ["front_chamber:bracket_set", "front_chamber:northwest_corner"], label: "前室顶部铺作" }
      ]
    },
    {
      id: "R02",
      title: "后室身份抹除",
      summary: "用后室北壁、地券、人骨和入口背面这些已实现证据，建立后室异常葬仪的简化链。",
      requirements: [
        { id: "rear_chamber:woman_door", label: "妇人启门" },
        { id: "rear_chamber:land_deed", label: "地券" },
        { id: "rear_chamber:bones_nails", label: "人骨与铁钉" },
        { anyOf: ["rear_chamber:rear_south_back_entrance", "rear_chamber:rear_south_high_table"], label: "后室南壁入口背面或高几" }
      ]
    },
    {
      id: "R03",
      title: "过道-甬道时间层",
      summary: "用甬道顶部错位、两壁方向差和过道题记，建立时间层冲突的简化链。",
      requirements: [
        { id: "passage:inscription", label: "纪年题记" },
        { id: "corridor:overlapping_pattern", label: "甬道重绘痕迹" },
        { anyOf: ["corridor:east_wall_direction", "corridor:west_wall_inscription"], label: "甬道两壁对照" },
        { id: "passage:ceiling_canopy", label: "过道顶部宝盖" }
      ]
    },
    {
      id: "R04",
      title: "后期进入分层",
      summary: "用题记、文书、遗存、重绘和颜料覆盖，建立多次后期进入的简化链。",
      requirements: [
        { id: "passage:inscription", label: "过道题记" },
        { id: "rear_chamber:land_deed", label: "地券" },
        { id: "rear_chamber:bones_nails", label: "人骨与铁钉" },
        { id: "corridor:overlapping_pattern", label: "甬道叠胜彩画" },
        { id: "rear_chamber:rear_northwest_pigment_layer", label: "西北壁颜料层位" }
      ]
    },
    {
      id: "R05",
      title: "礼仪身份序列",
      summary: "用东壁女乐、南壁壁函和北壁分区，建立前室礼仪空间的简化链。",
      requirements: [
        { id: "front_chamber:female_musicians", label: "东壁女乐" },
        {
          anyOf: [
            "front_chamber:south_wall_overview",
            "front_chamber:east_wall_niche",
            "front_chamber:west_wall_niche",
            "front_chamber:painted_column"
          ],
          label: "南壁壁函与倚柱"
        },
        { anyOf: ["front_chamber:north_west_mural", "front_chamber:north_east_mural"], label: "北壁过渡分区" }
      ]
    },
    {
      id: "R06",
      title: "后室日常化叙事",
      summary: "用后室南壁、西南壁、西北壁和顶部近景，建立后室日常器物线的简化链。",
      requirements: [
        { id: "rear_chamber:rear_south_high_table", label: "南壁高几" },
        { anyOf: ["rear_chamber:rear_southwest_mirror_stand", "rear_chamber:rear_southwest_basin_stand"], label: "西南壁梳洗器物" },
        { anyOf: ["rear_chamber:rear_northeast_lamp", "rear_chamber:rear_northwest_scissors_iron"], label: "东北/西北壁日常器物" },
        { anyOf: ["rear_chamber:rear_ceiling_intermediate_bracket", "rear_chamber:rear_ceiling_small_bracket"], label: "后室顶部结构" }
      ]
    },
    {
      id: "R07",
      title: "空间压缩与后室高潮",
      summary: "第一版先用入口推进和后室核心证据，替代平剖面定位形成简化高潮链。",
      requirements: [
        { sceneId: "tomb_gate", completed: true, label: "完成墓门章节" },
        { sceneId: "corridor", completed: true, label: "完成甬道章节" },
        { sceneId: "passage", completed: true, label: "完成过道章节" },
        { id: "rear_chamber:woman_door", label: "妇人启门" },
        { id: "rear_chamber:find_distribution", label: "出土物分布图" }
      ]
    },
    {
      id: "R08",
      title: "墓门结构扩展线",
      summary: "原总表里的三墓联动暂未落地，第一版先把墓门结构线独立成后续扩展入口。",
      requirements: [
        { id: "tomb_gate:lintel_back", label: "门额背面彩画" },
        { id: "tomb_gate:brick_seam", label: "封门砖缝" },
        { id: "tomb_gate:threshold", label: "门前地面" }
      ]
    },
    {
      id: "R09",
      title: "核心真相",
      summary: "当前版把前室、后室、甬道与过道中已经成立的关键判断汇成终章主线。",
      requirements: [
        { relationId: "R01", label: "前室重绘" },
        { relationId: "R02", label: "后室身份抹除" },
        { relationId: "R03", label: "过道-甬道时间层" },
        { relationId: "R04", label: "后期进入分层" },
        { relationId: "R06", label: "后室日常化叙事" }
      ]
    }
  ]
};

const NPC_DATA = {
  opening: [
    {
      id: "opening_villager",
      kicker: "墓外开场",
      speaker: "附近村民",
      title: "墓群边的提醒",
      body: "这片地早年有人挖出过砖，没人敢往深处动。你们要下去，先把方向和入口认准。"
    },
    {
      id: "opening_professor",
      kicker: "调查说明",
      speaker: "考古领队",
      title: "进入 M1 前",
      body: "先确认空间，再谈图像。入口、墙面、顶部要分开记，不要急着把单条异象当结论。"
    }
  ],
  sceneEntries: {
    tomb_gate: {
      kicker: "章节入口",
      speaker: "考古技工",
      title: "先看结构",
      body: "先别急着看图案，砖缝、封门和门额位置都要记。"
    },
    corridor: {
      kicker: "章节入口",
      speaker: "考古技工",
      title: "先看顶部",
      body: "这段通道低，起拱线和顶上的重画痕迹更容易露出来。"
    },
    front_chamber: {
      kicker: "章节入口",
      speaker: "考古队员",
      title: "先总览再分墙",
      body: "先把入口总照记住，再分东、西、南、北和顶部去看。"
    },
    passage: {
      kicker: "章节入口",
      speaker: "考古队员",
      title: "注意题记位置",
      body: "这张近景要和前后墙面对照，题记的位置本身就值得记。"
    },
    rear_chamber: {
      kicker: "章节入口",
      speaker: "考古队员",
      title: "先核对编号",
      body: "后室别只盯北壁，把地券、人骨、分布图和多面器物一起编号。"
    }
  },
  sceneCompletions: {
    tomb_gate: {
      kicker: "章节完成",
      speaker: "考古领队",
      title: "墓门判断",
      body: "墓门已经说明，这里不是只靠一眼就能看穿的入口。继续向内，看通道如何承接它。"
    },
    corridor: {
      kicker: "章节完成",
      speaker: "考古领队",
      title: "甬道判断",
      body: "通道的顶部和两壁已经形成过渡关系，前室应当会把这种组织推到更完整。"
    },
    front_chamber: {
      kicker: "章节完成",
      speaker: "考古领队",
      title: "前室判断",
      body: "前室已经能成立为礼仪空间，但年代张力还需要过道的文字和结构去压实。"
    },
    passage: {
      kicker: "章节完成",
      speaker: "考古领队",
      title: "过道判断",
      body: "题记不能单独说明问题，但它已经把你带到后室的核心矛盾前面了。"
    },
    rear_chamber: {
      kicker: "章节完成",
      speaker: "考古领队",
      title: "后室判断",
      body: "后室图像、遗存和日常器物已经开始互相解释，现阶段可以进入终章汇总。"
    },
    final_report: {
      kicker: "终章汇总",
      speaker: "考古领队",
      title: "第一版研究判断",
      body: "把章节结论并在一起看，M1 的异常更像多次调整留下的叠层结果，而不是单一事件。"
    }
  }
};

const ANALYSIS_DATA = {
  journalTracks: [
    { id: "observation", label: "观察记录", emptyText: "先在场景中收集能进入分析流程的现场观察。" },
    { id: "review", label: "工具复查", emptyText: "复查记录会在满足条件后出现在这里。" },
    { id: "pending", label: "待验证", emptyText: "目前没有需要优先排除的单点异常。" },
    { id: "excluded", label: "已排除", emptyText: "被降级或排除的误导线索会收在这里。" }
  ],
  sceneWorkflows: {
    tomb_gate: {
      chapter: "墓门",
      reviewSteps: [
        {
          id: "review_surface_compare",
          buttonLabel: "用手电和拓片纸复查门额前后",
          description: "把正面题字与背面彩画放在一起，确认它们是否来自同一处理层。",
          sourceRecordIds: ["tomb_gate:lintel", "tomb_gate:lintel_back"],
          resultRecord: {
            id: "analysis:tomb_gate:review_surface_compare",
            sceneId: "tomb_gate",
            title: "门额前后层次复查",
            text: "手电与拓片复查显示，门额正面题字和背面卷草纹不在同一处理层；背面朱红底与下缘裁切线提示门额前后经历过不同层次的处理。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_sealing_structure",
          buttonLabel: "用标尺复查封门方式",
          description: "把封门砖缝和门前地面一起看，判断灰缝异常是否真能上升为主线。",
          sourceRecordIds: ["tomb_gate:brick_seam", "tomb_gate:threshold"],
          resultRecord: {
            id: "analysis:tomb_gate:review_sealing_structure",
            sceneId: "tomb_gate",
            title: "封门方式复查",
            text: "标尺复查显示，石英砂灰缝与周围胶结状态一致，砖下缘和地面交界连续。石英砂更像封门砌筑细节，不能单独当作异常主证。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      pendingResolutions: [
        {
          recordId: "tomb_gate:brick_seam",
          buttonLabel: "将石英砂灰缝降级为待排除线索",
          description: "单点颗粒异常不足以直接进入主线结论。",
          requiresReviewRecordIds: ["analysis:tomb_gate:review_sealing_structure"],
          resolutionText: "封门砖缝中的石英砂已被降级为待排除线索；它更像砌筑细节，不能直接支撑墓门异常判断。"
        }
      ],
      combination: {
        buttonLabel: "形成墓门章节组合判断",
        description: "把门额前后层次和封门方式复查合并，生成墓门的阶段性判断。",
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
          buttonLabel: "用手电和标尺复查顶部错位",
          description: "把顶部整体、叠胜彩画和起拱边线放进同一组，确认错位是否真成立。",
          sourceRecordIds: ["corridor:corridor_roof", "corridor:overlapping_pattern", "corridor:roof_arch_line"],
          resultRecord: {
            id: "analysis:corridor:review_roof_alignment",
            sceneId: "corridor",
            title: "顶部错位复查",
            text: "甬道顶部整体、叠胜彩画偏移和起拱边线一起复查后，可以确认顶部并非单纯装饰，而保留了调整与重整的痕迹。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_direction",
          buttonLabel: "用结构图复查通道导向",
          description: "把甬道中段和两壁方向放在一起，判断甬道是否承担引导功能。",
          sourceRecordIds: ["corridor:corridor_mid", "corridor:east_wall_direction", "corridor:west_wall_inscription"],
          resultRecord: {
            id: "analysis:corridor:review_direction",
            sceneId: "corridor",
            title: "通道导向复查",
            text: "结构图复查表明，甬道中段的压缩感与两壁画面朝向共同把视线推向前室，甬道承担的是过渡与引导功能。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      combination: {
        buttonLabel: "形成甬道章节组合判断",
        description: "把顶部错位和通道导向两条复查链合并，生成甬道阶段判断。",
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
          buttonLabel: "用标尺和对照图复查西壁器物",
          description: "把注子、高瓶和砖砌桌放进同一组，确认前室器物是否来自同一时间层。",
          sourceRecordIds: ["front_chamber:ewer", "front_chamber:high_bottle", "front_chamber:brick_table"],
          resultRecord: {
            id: "analysis:front_chamber:review_artifact_tension",
            sceneId: "front_chamber",
            title: "器物年代与重绘复查",
            text: "标尺与对照图复查显示，西壁注子与高瓶瓶座的形制深浅并不一致，再结合砖砌桌侧细槽与阴影方向错位，可确认前室器物线同时保留了年代错层和局部重绘痕迹。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_ritual_sequence",
          buttonLabel: "用结构图复查礼仪动线",
          description: "把东壁女乐、南壁入口与北壁两段画面放在一起，确认前室是否形成礼仪引导序列。",
          sourceRecordIds: ["front_chamber:female_musicians", "front_chamber:south_wall_overview", "front_chamber:north_west_mural", "front_chamber:north_east_mural"],
          resultRecord: {
            id: "analysis:front_chamber:review_ritual_sequence",
            sceneId: "front_chamber",
            title: "礼仪动线复查",
            text: "结构图复查表明，东壁女乐、南壁入口分区与北壁东西两段的密度差共同构成了从迎引、停驻到继续通行的礼仪动线，前室不是分散图像的堆叠。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_partition_structure",
          buttonLabel: "用手电复查入口分区与顶部结构",
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
            title: "入口分区与顶部结构复查",
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
          description: "单一鞋型不足以直接推断人物身份、年代或前室主功能。",
          requiresReviewRecordIds: ["analysis:front_chamber:review_ritual_sequence"],
          resolutionText: "女乐尖鞋已被降级为服饰细节；它只能补充人物形象，不能脱离礼仪动线单独支撑前室主线结论。"
        },
        {
          recordId: "front_chamber:east_wall_surface",
          buttonLabel: "将东壁温差降级为体感异常",
          description: "手电照射下的短暂温差缺少稳定对照，暂不能上升为主线证据。",
          requiresReviewRecordIds: ["analysis:front_chamber:review_partition_structure"],
          resolutionText: "东壁温差已被降级为体感异常；在缺少稳定对照的情况下，它不能直接证明前室存在独立异常层。"
        }
      ],
      combination: {
        buttonLabel: "形成前室章节组合判断",
        description: "把器物、礼仪动线和入口分区三条复查链合并，生成前室阶段判断。",
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
          text: "西壁器物的年代错层与局部重绘、东壁至北壁的礼仪动线，以及南壁到顶部的入口分区共同说明，前室是被主动组织过的礼仪展示空间；尖鞋和体感温差这类单点异常不能替代主链判断。",
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
          buttonLabel: "用手电和结构图复查假门图像",
          description: "把北壁整体、妇人启门和门缝槽口放在一起，确认假门图像是否构成稳定的主链。",
          sourceRecordIds: ["rear_chamber:rear_wall_overview", "rear_chamber:woman_door", "rear_chamber:door_gap"],
          resultRecord: {
            id: "analysis:rear_chamber:review_false_door_structure",
            sceneId: "rear_chamber",
            title: "假门图像复查",
            text: "手电与结构图复查显示，后室北壁假门、妇人启门姿态与门缝槽口宽度可以互相印证，这不是孤立的人物图像，而是一组被明确组织过的假门图像线索。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_document_layer",
          buttonLabel: "用拓片纸复查地券文书",
          description: "把地券整体、券文和行列字数放进同一组，确认文书本身是否足以进入主链。",
          sourceRecordIds: ["rear_chamber:land_deed", "rear_chamber:land_deed_text", "rear_chamber:land_deed_lines"],
          resultRecord: {
            id: "analysis:rear_chamber:review_document_layer",
            sceneId: "rear_chamber",
            title: "地券文书复查",
            text: "拓片复查显示，地券的朱书层、县村书写方式与行列字数变化共同说明，这份文书不仅能确认后室身份线，也保留了需要谨慎辨析的处理层次。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_burial_distribution",
          buttonLabel: "串联葬具证据链",
          description: "先框定砖床边界，再叠合人骨与铁钉，最后回到地券文书。按这个顺序复查，可以确认哪些信息是空间定位，哪些信息是文书层。",
          sourceRecordIds: [
            "rear_chamber:north_lower_bed_boundary",
            "rear_chamber:north_lower_bed_axis",
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
              detail: "后室入口总览 → 北壁 → 北壁下部；点砖床边界和假门-砖床轴线。",
              mobileDetail: "北壁 → 北壁下部；点砖床边界、轴线。",
              recordIds: ["rear_chamber:north_lower_bed_boundary", "rear_chamber:north_lower_bed_axis"]
            },
            {
              label: "2 人骨铁钉",
              detail: "回到北壁；点人骨与铁钉，再在人骨近景点铁钉数量。",
              mobileDetail: "北壁 → 人骨与铁钉；点铁钉数量。",
              recordIds: ["rear_chamber:bones_nails", "rear_chamber:nail_count"]
            },
            {
              label: "3 分布与人骨位置",
              detail: "回到北壁；点出土物分布图，再进入人骨位置，确认葬具范围。",
              mobileDetail: "北壁 → 分布图 → 人骨位置。",
              recordIds: ["rear_chamber:distribution_map", "rear_chamber:bones_position_burial_range"]
            },
            {
              label: "4 地券并盖",
              detail: "回到北壁；点地券 → 地券并盖 → 地券本体，把文书层接入链条。",
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
            title: "葬具证据链复查",
            text: "小面板复查显示，砖床边界先限定后室遗存的空间范围，人骨和铁钉需要在这个范围内叠合判断，地券则作为文书层补充定位；真正稳定的主证不是某个角点数字，而是遗存、痕迹和文书共同回到砖床关系中。",
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
          description: "单一手指断口只能说明局部残损或后期破坏，不能直接改写假门图像主链。",
          requiresReviewRecordIds: ["analysis:rear_chamber:review_false_door_structure"],
          blockedText: "先完成假门图像复查，再处理这条手部断口。它要回到北壁假门、妇人启门和门缝槽口的整体关系里判断。",
          readyText: "假门图像复查已完成。现在可以把手部断口降级为局部残损，避免它单独替代北壁假门结构判断。",
          resolutionText: "妇人手部新断口已被降级为局部残损；它可以提示后期破坏，但不能脱离假门整体结构单独推导后室主结论。"
        },
        {
          recordId: "rear_chamber:nail_count",
          priority: 20,
          buttonLabel: "将铁钉数量异常降级为角点细节",
          description: "铁钉数量差异必须先放回砖床、人骨位置和地券文书的同一条证据链中复查；它不能抢在整体分布关系之前作结论。",
          requiresReviewRecordIds: ["analysis:rear_chamber:review_burial_distribution"],
          blockedText: "先完成葬具证据链复查，再处理铁钉数量。原因是东北角、西南角的钉数差只能说明角点细节，必须和砖床边界、人骨范围、地券文书一起判断。",
          readyText: "葬具证据链已完成。现在可以把铁钉数量异常降级为角点细节：它参与说明葬具痕迹，但不能单独推出额外葬仪异常。",
          resolutionText: "铁钉数量异常已被降级为角点细节；它需要依附于砖床边界、人骨范围和地券文书的整体关系，不能单独证明后室存在额外葬仪异常。"
        }
      ],
      combination: {
        buttonLabel: "形成后室章节组合判断",
        description: "把假门图像、地券文书和葬具证据链三条复查结果合并，生成后室第一版判断。",
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
            label: "1 假门图像复查",
            missingText: "先完成北壁整体、妇人启门和门缝槽口的复查。",
            metText: "假门图像复查已完成。"
          },
          {
            id: "analysis:rear_chamber:review_document_layer",
            label: "2 地券文书复查",
            missingText: "先完成地券整体、券文和行列关系的复查。",
            metText: "地券文书复查已完成。"
          },
          {
            id: "analysis:rear_chamber:review_burial_distribution",
            label: "3 葬具证据链复查",
            missingText: "先完成砖床、人骨、铁钉和地券之间的证据链复查。",
            metText: "葬具证据链复查已完成。"
          },
          {
            excludedId: "rear_chamber:woman_hand",
            label: "4 降级手部断口",
            missingText: "在待验证中把妇人手部断口降级为局部残损。",
            metText: "妇人手部断口已降级。"
          },
          {
            excludedId: "rear_chamber:nail_count",
            label: "5 降级铁钉数量",
            missingText: "在待验证中把铁钉数量异常降级为角点细节。",
            metText: "铁钉数量异常已降级。"
          }
        ],
        resultRecord: {
          id: "analysis:rear_chamber:combo",
          sceneId: "rear_chamber",
          title: "后室组合判断",
          text: "假门图像、地券文书与葬具证据链共同说明，后室第一版的核心证据来自图像、文书和遗存的互相印证；手部断口和角点钉数这类单点异常不能替代这条主链。",
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
          buttonLabel: "用手电和拓片纸复查题记层次",
          description: "把题记整体、文字和下沿放在一起，判断文字与壁画是否同层。",
          sourceRecordIds: ["passage:inscription", "passage:inscription_text", "passage:inscription_lower_edge"],
          resultRecord: {
            id: "analysis:passage:review_inscription_layer",
            sceneId: "passage",
            title: "题记层次复查",
            text: "题记整体、文字与下沿复查后，可以确认低处浓墨与周围壁画色层关系并不简单，过道保留了明确的时间层信息。",
            track: "review",
            recordType: "review"
          }
        },
        {
          id: "review_spatial_structure",
          buttonLabel: "用结构图复查窗棂与宝盖",
          description: "把棂窗、窗格线条和顶部宝盖合并，判断过道的空间组织方式。",
          sourceRecordIds: ["passage:lattice_window", "passage:lattice_lines", "passage:ceiling_canopy", "passage:canopy_center"],
          resultRecord: {
            id: "analysis:passage:review_spatial_structure",
            sceneId: "passage",
            title: "窗棂与宝盖复查",
            text: "结构图复查显示，棂窗侧向展开而宝盖沿中线收束，过道在狭窄空间里同时承担展开与压缩两种作用。",
            track: "review",
            recordType: "review"
          }
        }
      ],
      pendingResolutions: [
        {
          recordId: "passage:tassel",
          buttonLabel: "将流苏降级为装饰性细节",
          description: "流苏方向变化目前只构成细部信息，不能独立推动过道主线。",
          requiresReviewRecordIds: ["analysis:passage:review_spatial_structure"],
          resolutionText: "流苏已被降级为装饰性细节；在当前证据链里，它不足以单独推动过道的主线判断。"
        }
      ],
      combination: {
        buttonLabel: "形成过道章节组合判断",
        description: "把题记层次与空间结构两条复查链合并，生成过道阶段判断。",
        requiresReviewRecordIds: ["analysis:passage:review_inscription_layer", "analysis:passage:review_spatial_structure"],
        requiresExcludedRecordIds: ["passage:tassel"],
        resultRecord: {
          id: "analysis:passage:combo",
          sceneId: "passage",
          title: "过道组合判断",
          text: "题记层次与窗棂、宝盖的空间复查共同说明，过道是时间信息与空间转换交汇的节点，单点装饰细节不能替代这条主链。",
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

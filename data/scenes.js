(function () {
const SAVE_KEY = "m1-gate-immersive-state-v2-source-text";
const START_SCENE_ID = "tomb_gate";
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
    tomb_gate: "墓门 / 面向墓门",
    corridor: "甬道 / 面向前室方向",
    passage_main: "过道 / 面向东壁",
    passage_inscription_closeup: "过道 / 纪年题记近景",
    passage_lattice_closeup: "过道 / 破子棂窗近景",
    passage_canopy_closeup: "过道 / 抬头看顶部宝盖",
    passage_tassel_closeup: "过道 / 流苏近景",
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
    front_west_table_closeup: "前室 / 西壁砖砌桌近景",
    front_east_shoes_closeup: "前室 / 东壁尖鞋近景",
    front_west_ewer_closeup: "前室 / 西壁注子近景",
    rear_north: "后室 / 面向北壁",
    rear_woman_closeup: "后室 / 妇人启门近景",
    rear_land_deed_closeup: "后室 / 砖床地券近景",
    rear_bones_nails_closeup: "后室 / 人骨与铁钉近景",
    rear_distribution_closeup: "后室 / 出土物分布图"
  }
};

const SCENES = {
  tomb_gate: {
    id: "tomb_gate",
    title: "第一号墓墓门",
    image: {
      src: "assets/door.png",
      alt: "第一号墓墓门",
      width: 4693,
      height: 3520
    },
    hotspots: [
      {
        id: "lintel",
        label: "墓门门额",
        shape: "rect",
        rect: [0.37, 0.14, 0.63, 0.31],
        title: "墓门门额",
        body: "墓门门额正面题有墓主信息。\n门额背面可见一幅完整的卷草纹彩画。\n正面为题字，背面为彩画，质地与图像均不相同。",
        record: "墓门门额正面题有墓主信息，背面可见完整卷草纹彩画。",
        sourceFile: "M1/02墓道与墓门/02墓道与墓门-线索映射-v1.0.md",
        sourceClueId: "L07"
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
        sourceClueId: "L07"
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
        sourceClueId: "H01"
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
        sourceClueId: "ENV-S02"
      }
    ]
  },
  corridor: {
    id: "corridor",
    title: "第一号墓甬道",
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
        sourceClueId: "L06"
      },
      {
        id: "east_wall",
        label: "东壁壁画",
        shape: "rect",
        rect: [0.04, 0.28, 0.2, 0.9],
        title: "东壁壁画",
        body: "甬道东壁壁画沿通道展开。\n人物与器物朝向墓室深处。\n画面与西壁相对，形成甬道两侧的连续图像。",
        record: "甬道东壁壁画沿通道展开，人物与器物朝向墓室深处。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "S03-EAST-WALL"
      },
      {
        id: "west_wall",
        label: "西壁壁画",
        shape: "rect",
        rect: [0.8, 0.28, 0.96, 0.9],
        title: "西壁壁画",
        body: "甬道西壁壁画与东壁相对。\n局部题字位于壁面较低处。\n题字周围留白较宽，人物与器物线条仍可辨认。",
        record: "甬道西壁局部题字位置较低，题字周围留白较宽。",
        sourceFile: "M1/03甬道/03甬道-线索映射-v1.0.md",
        sourceClueId: "S03-WEST-WALL"
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
  passage: {
    id: "passage",
    title: "第一号墓过道",
    startViewId: "passage_main",
    views: {
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
            id: "return_front_chamber",
            label: "返回前室",
            navLabel: "返回前室",
            shape: "rect",
            rect: [0, 0.82, 0.28, 1],
            title: "返回前室",
            body: "前室北壁仍在身后。\n已经记录的信息会保留。",
            record: "返回前室。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "front_chamber",
              targetViewId: "front_north_west",
              unlocked: true,
              title: "返回前室",
              body: "你退回前室北壁。\n过道中的观察可以稍后继续。",
              closeLabel: "返回"
            }
          },
          {
            id: "rear_chamber_placeholder",
            label: "后室入口",
            navLabel: "后室入口",
            shape: "rect",
            rect: [0.3, 0.82, 0.78, 1],
            title: "后室入口",
            body: "过道尽头通向后室。\n入口处光线更暗，壁面和顶部线条在前方收束。\n后室入口的位置已经确认。",
            record: "后室入口位置已经确认。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "rear_chamber",
              completesSceneId: "passage",
              title: "后室入口",
              body: "题记在壁画下部留下深墨。\n破子棂窗向两侧展开，顶部宝盖向中心压低。\n过道尽头的入口已经可以进入。",
              closeLabel: "进入",
              lockedBody: "过道的信息还没有整理完整。",
              missingRecords: [
                { id: "passage:inscription_reading_record", label: "完成题记辨读" },
                { id: "passage:lattice_window", label: "破子棂窗" },
                { id: "passage:ceiling_canopy", label: "顶部宝盖" }
              ]
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
    startViewId: "rear_north",
    completionHint: {
      sourceHotspotId: "rear_summary",
      text: "四项后室材料已经记录。\n可以回到后室北壁右下方汇总。"
    },
    views: {
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
            label: "返回过道",
            navLabel: "返回过道",
            shape: "rect",
            rect: [0, 0.84, 0.16, 1],
            title: "返回过道",
            body: "过道仍在身后。\n已经记录的信息会保留。",
            record: "返回过道。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              targetViewId: "passage_main",
              unlocked: true,
              title: "返回过道",
              body: "你退回过道。\n后室中的观察可以稍后继续。",
              closeLabel: "返回"
            }
          },
          {
            id: "rear_summary",
            label: "后室完成确认",
            navLabel: "汇总后室",
            shape: "rect",
            rect: [0.84, 0.84, 1, 1],
            title: "后室完成确认",
            body: "假门、地券、人骨与铁钉、出土物分布图均已记录。\n后室北壁与砖床区域的主要材料已经对应。\n后室第一版观察完成。",
            record: "后室第一阶段材料已经汇总。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              completeOnly: true,
              completesSceneId: "rear_chamber",
              title: "后室完成确认",
              body: "假门、地券、人骨与铁钉、出土物分布图均已记录。\n后室北壁与砖床区域的主要材料已经对应。\n后室第一版观察完成。",
              closeLabel: "记下",
              lockedBody: "后室的信息还没有整理完整。",
              missingRecords: [
                { id: "rear_chamber:woman_door", label: "妇人启门" },
                { id: "rear_chamber:land_deed", label: "地券" },
                { id: "rear_chamber:bones_nails", label: "人骨与铁钉" },
                { id: "rear_chamber:find_distribution", label: "出土物分布图" },
                { id: "rear_chamber:relic_position_record", label: "完成后室遗物定位" }
              ]
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
            sourceClueId: "L02"
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
            record: "返回后室北壁。",
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
            record: "返回后室北壁。",
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
            sourceClueId: "L04"
          },
          {
            id: "return_rear_north_from_bones",
            label: "返回后室北壁",
            navLabel: "返回后室北壁",
            shape: "rect",
            rect: [0, 0.86, 1, 1],
            title: "返回后室北壁",
            body: "人骨与铁钉重新回到砖床空间中。",
            record: "返回后室北壁。",
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
            record: "返回后室北壁。",
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
    startViewId: "front_west",
    views: {
      front_west: {
        id: "front_west",
        title: "第一号墓前室西壁",
        image: {
          src: "assets/front-west.png",
          alt: "第一号墓前室西壁",
          width: 1774,
          height: 1490
        },
        hotspots: [
          {
            id: "return_corridor",
            label: "返回甬道",
            navLabel: "返回甬道",
            shape: "rect",
            rect: [0.02, 0.72, 0.22, 0.96],
            title: "返回甬道",
            body: "身后的甬道仍可复查。\n前室的器物线索不会消失。",
            record: "返回甬道复查。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "corridor",
              unlocked: true,
              title: "返回甬道",
              body: "你退回甬道。\n顶部彩画和两侧壁面仍在原处。",
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
      front_east: {
        id: "front_east",
        title: "第一号墓前室东壁",
        image: {
          src: "assets/front-east.png",
          alt: "第一号墓前室东壁",
          width: 2256,
          height: 1330
        },
        hotspots: [
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
            sourceClueId: "E02"
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
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0.02, 0.18, 0.18, 0.86],
            title: "返回西壁",
            body: "东壁人物已经记录。\n器物线索仍需回到西壁对照。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "西壁器物重新进入视线。",
              closeLabel: "返回"
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
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.18, 0.18, 0.88],
            title: "返回西壁",
            body: "西壁的器物与家具重新进入视线。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "西壁的器物与家具重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_east_from_south",
            label: "返回东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0.82, 0.18, 1, 0.88],
            title: "返回东壁",
            body: "东壁的人物图像重新进入视线。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "返回东壁",
              body: "东壁的人物图像重新进入视线。",
              closeLabel: "返回"
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
            label: "前室出口",
            navLabel: "进入过道",
            shape: "rect",
            rect: [0.34, 0.76, 0.66, 0.98],
            title: "前室出口",
            body: "北壁一侧的画面更密，通向内侧的方向重新进入视线。\n前室四壁与顶部的信息已经整理完成。\n过道入口的位置已经确认。",
            record: "前室出口位置已经确认。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              completesSceneId: "front_chamber",
              title: "前室出口",
              body: "前室四壁与顶部已经形成对应。\n器物、人物、壁函和铺作不再只是分散图像。\n北壁一侧的画面更密，过道入口重新进入视线。",
              closeLabel: "进入",
              lockedBody: "前室的信息还没有整理完整。",
              missingRecords: [
                { anyOf: ["front_chamber:ewer", "front_chamber:high_bottle"], label: "西壁器物" },
                { id: "front_chamber:female_musicians", label: "东壁人物" },
                { anyOf: ["front_chamber:south_wall_overview", "front_chamber:east_wall_niche", "front_chamber:west_wall_niche", "front_chamber:painted_column"], label: "南壁壁函" },
                { id: "front_chamber:north_west_mural", label: "北壁西部画面" },
                { id: "front_chamber:north_east_mural", label: "北壁东部画面" },
                { anyOf: ["front_chamber:bracket_set", "front_chamber:northwest_corner"], label: "顶部铺作" }
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
            id: "return_west_from_north_west",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.18, 0.18, 0.88],
            title: "返回西壁",
            body: "西壁的器物与家具重新进入视线。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "西壁的器物与家具重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_east_from_north_west",
            label: "返回东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0.18, 0.86, 0.48, 1],
            title: "返回东壁",
            body: "东壁的人物图像重新进入视线。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "返回东壁",
              body: "东壁的人物图像重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_south_from_north_west",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0.52, 0.86, 0.82, 1],
            title: "返回南壁",
            body: "南壁的壁函与倚柱重新进入视线。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "返回南壁",
              body: "南壁的壁函与倚柱重新进入视线。",
              closeLabel: "返回"
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
            label: "前室出口",
            navLabel: "进入过道",
            shape: "rect",
            rect: [0.34, 0.76, 0.66, 0.98],
            title: "前室出口",
            body: "北壁一侧的画面更密，通向内侧的方向重新进入视线。\n前室四壁与顶部的信息已经整理完成。\n过道入口的位置已经确认。",
            record: "前室出口位置已经确认。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            transition: {
              targetSceneId: "passage",
              completesSceneId: "front_chamber",
              title: "前室出口",
              body: "前室四壁与顶部已经形成对应。\n器物、人物、壁函和铺作不再只是分散图像。\n北壁一侧的画面更密，过道入口重新进入视线。",
              closeLabel: "进入",
              lockedBody: "前室的信息还没有整理完整。",
              missingRecords: [
                { anyOf: ["front_chamber:ewer", "front_chamber:high_bottle"], label: "西壁器物" },
                { id: "front_chamber:female_musicians", label: "东壁人物" },
                { anyOf: ["front_chamber:south_wall_overview", "front_chamber:east_wall_niche", "front_chamber:west_wall_niche", "front_chamber:painted_column"], label: "南壁壁函" },
                { id: "front_chamber:north_west_mural", label: "北壁西部画面" },
                { id: "front_chamber:north_east_mural", label: "北壁东部画面" },
                { anyOf: ["front_chamber:bracket_set", "front_chamber:northwest_corner"], label: "顶部铺作" }
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
            id: "return_west_from_north_east",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.86, 0.28, 1],
            title: "返回西壁",
            body: "西壁的器物与家具重新进入视线。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "西壁的器物与家具重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_east_from_north_east",
            label: "返回东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0.34, 0.86, 0.64, 1],
            title: "返回东壁",
            body: "东壁的人物图像重新进入视线。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "返回东壁",
              body: "东壁的人物图像重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_south_from_north_east",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0.7, 0.86, 1, 1],
            title: "返回南壁",
            body: "南壁的壁函与倚柱重新进入视线。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "返回南壁",
              body: "南壁的壁函与倚柱重新进入视线。",
              closeLabel: "返回"
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
            id: "return_west_from_ceiling",
            label: "返回西壁",
            navLabel: "返回西壁",
            shape: "rect",
            rect: [0, 0.78, 0.25, 1],
            title: "返回西壁",
            body: "西壁的器物与家具重新进入视线。",
            record: "返回前室西壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_west",
              title: "返回西壁",
              body: "西壁的器物与家具重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_east_from_ceiling",
            label: "返回东壁",
            navLabel: "返回东壁",
            shape: "rect",
            rect: [0.25, 0.78, 0.5, 1],
            title: "返回东壁",
            body: "东壁的人物图像重新进入视线。",
            record: "返回前室东壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_east",
              title: "返回东壁",
              body: "东壁的人物图像重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_south_from_ceiling",
            label: "返回南壁",
            navLabel: "返回南壁",
            shape: "rect",
            rect: [0.5, 0.78, 0.75, 1],
            title: "返回南壁",
            body: "南壁的壁函与倚柱重新进入视线。",
            record: "返回前室南壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_south",
              title: "返回南壁",
              body: "南壁的壁函与倚柱重新进入视线。",
              closeLabel: "返回"
            }
          },
          {
            id: "return_north_from_ceiling",
            label: "返回北壁",
            navLabel: "返回北壁",
            shape: "rect",
            rect: [0.75, 0.78, 1, 1],
            title: "返回北壁",
            body: "北壁西部壁画重新进入视线。",
            record: "返回前室北壁。",
            sourceFile: "game-navigation",
            sourceClueId: "NAV",
            viewTransition: {
              targetViewId: "front_north_west",
              title: "返回北壁",
              body: "北壁西部壁画重新进入视线。",
              closeLabel: "返回"
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
          src: "assets/front-west-bottle.png",
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
          src: "assets/front-west-table.png",
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
          src: "assets/front-east-shoes.png",
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
          src: "assets/front-west-ewer.png",
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

window.M1_GAME_DATA = {
  SAVE_KEY,
  START_SCENE_ID,
  POSITION_MAP,
  SCENES
};
})();

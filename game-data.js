/* Public player content for the static edition. Answers are evaluated in this browser. */
'use strict';
window.ARG_GAME_DATA = {
  "CASE": {
    "id": "fourth-act",
    "title": "第四幕的休止符",
    "subtitle": "把被删掉的那一晚，重新放回记录里。",
    "organizer": "林学院辩论队 · 社团文化节",
    "description": "《笼中鸟》首演停在第四幕。到摊位读纸档，在线上找物证。",
    "opening": [
      "槐川大学，10月18日。入围青幕高校社团联合创作赛的《笼中鸟》正在进行首演。19:40，饰演女主角的林知夏在第四幕遭遇威亚装置失效，坠落后抢救无效死亡。",
      "最初的事故说明把原因归为设备老化。演出结束后，一张后台照片和一份不同版本的流程单交到了辩论社负责人陈序手中，记录之间出现了无法忽略的矛盾。",
      "你受邀担任特别调查员。四份纸质档案放在各社团摊位，现场阅读后扫码登记。进入线上场景，寻找并收录图片物证。",
      "完成正常搜证并通过选择式推理，即可结案。责任判断没有统一的选边答案。",
      "本案为虚构故事。全部人物、学校、比赛与案情均为创作，不对应现实事件。"
    ],
    "estimated_minutes": "20—30（预估，待试玩校准；含阅读，不含排队与步行）",
    "characters": [
      {
        "id": "lin",
        "name": "林知夏",
        "archive_no": "P-01",
        "age": 21,
        "grade": "大三",
        "major": "戏剧影视文学",
        "club": "话剧社",
        "role": "联合项目申报人、女主角",
        "project_role": "负责申报、剧本统筹及第四幕演出",
        "relations": [
          "与四社团共同筹备《笼中鸟》，与陈序对接申报材料。"
        ],
        "known_facts": [
          "首演当天提出过第四幕地面方案。",
          "事故发生时正在第四幕演出。"
        ],
        "status": "已故",
        "statement_source": "演前排练备忘与项目流程记录",
        "portrait_url": "./assets/dossiers/portraits.webp",
        "portrait_index": 0,
        "statement": "她留下了剧本、申报材料和演出前的流程意见。请让原始记录替她发言。"
      },
      {
        "id": "lu",
        "name": "陆远",
        "archive_no": "P-02",
        "age": 20,
        "grade": "大二",
        "major": "生物科学",
        "club": "生物社",
        "role": "联合项目材料负责人",
        "project_role": "登记、保管和交接舞美材料",
        "relations": [
          "与赵天宇对接项目材料，与林知夏讨论舞美需求。"
        ],
        "known_facts": [
          "演出当日负责联合项目材料室。",
          "材料登记册留有他的签名。"
        ],
        "status": "可供调查",
        "statement_source": "事故后项目组人员口述摘录",
        "portrait_url": "./assets/dossiers/portraits.webp",
        "portrait_index": 1,
        "statement": "我只处理舞美和材料。首演前确实有人来领东西，但后台的装置不归我管。"
      },
      {
        "id": "su",
        "name": "苏蔓",
        "archive_no": "P-03",
        "age": 21,
        "grade": "大三",
        "major": "应用心理学",
        "club": "心理社",
        "role": "联合项目人员联络",
        "project_role": "维护演职人员通知及流程版本",
        "relations": [
          "负责向林知夏及各社团转达项目安排。"
        ],
        "known_facts": [
          "演出当天发布了第四幕流程通知。",
          "项目工作账号保存着通知记录。"
        ],
        "status": "可供调查",
        "statement_source": "事故后项目组人员口述摘录",
        "portrait_url": "./assets/dossiers/portraits.webp",
        "portrait_index": 2,
        "statement": "流程变了好几次。我发的是最后确认版，大家当时都在赶演出。"
      },
      {
        "id": "zhao",
        "name": "赵天宇",
        "archive_no": "P-04",
        "age": 22,
        "grade": "大四",
        "major": "体育教育",
        "club": "武术社",
        "role": "舞台动作协作负责人",
        "project_role": "协调动作排练与后台走位",
        "relations": [
          "与林知夏对接第四幕动作，与陆远对接项目物料。"
        ],
        "known_facts": [
          "事故后提交了本人行踪说明及训练录像。",
          "他负责的社团参与了舞台动作协作。"
        ],
        "status": "可供调查",
        "statement_source": "10月18日20:30本人提交的行踪说明",
        "portrait_url": "./assets/dossiers/portraits.webp",
        "portrait_index": 3,
        "statement": "那段时间我一直在排练区带队，训练录像可以作证。"
      },
      {
        "id": "chen",
        "name": "陈序",
        "archive_no": "P-05",
        "age": 21,
        "grade": "大三",
        "major": "法学",
        "club": "辩论社",
        "role": "项目材料整理、调查发起人",
        "project_role": "协助整理申报、事故说明及调查资料",
        "relations": [
          "与林知夏对接申报，事故后收集各社团材料。"
        ],
        "known_facts": [
          "整理过第一版事故说明。",
          "提出重新核对照片与流程版本。"
        ],
        "status": "调查发起人",
        "statement_source": "调查发起时的公开口述",
        "portrait_url": "./assets/dossiers/portraits.webp",
        "portrait_index": 4,
        "statement": "我整理过申报和事故说明。现在请以你能找到的原始材料为准，包括我写过的材料。"
      }
    ],
    "timeline": [
      {
        "time": "10月18日 18:30",
        "event": "观众入场，演职人员进入候场区。"
      },
      {
        "time": "10月18日 19:00",
        "event": "《笼中鸟》首演开始。"
      },
      {
        "time": "10月18日 19:40",
        "event": "第四幕装置失效，演出中止。"
      },
      {
        "time": "10月18日 21:10",
        "event": "联合项目组整理第一版事故说明。"
      }
    ],
    "reward": {
      "limit": 30,
      "description": "完成正常搜证与结案后，请向现场工作人员出示结案记录，人工核验并登记NFC特别调查员纪念卡。全场限量30张，领取顺序与剩余库存以现场登记为准；发完后仍可继续调查与结案。",
      "identity_distribution": "观察者、质询者、裁决者各10张，随机发放，不区分能力等级。",
      "hidden_policy": "隐藏线索不影响正常通关与领奖资格。",
      "access": "NFC与公共二维码进入同一玩家网站；未持卡玩家仍可完成主线，并在现场交流责任立场。"
    }
  },
  "LOCATIONS": [
    {
      "id": "theatre",
      "name": "第四幕后台",
      "club": "话剧社",
      "eyebrow": "现场一 · 演出留下了什么",
      "description": "查阅摊位纸档，再检查后台留下的剧本与连接部件。",
      "scene_key": "theatre",
      "documents": [
        "theatre-report"
      ],
      "physical": [
        "theatre-script",
        "theatre-rig",
        "debate-draft"
      ]
    },
    {
      "id": "bio",
      "name": "联合项目材料室",
      "club": "生物社",
      "eyebrow": "现场二 · 物品如何离开材料室",
      "description": "纸档记录材料流转；工作台与周转箱留下了原物。",
      "scene_key": "bio",
      "documents": [
        "bio-register"
      ],
      "physical": [
        "bio-handoff",
        "bio-label"
      ]
    },
    {
      "id": "psych",
      "name": "联创工作区",
      "club": "心理社",
      "eyebrow": "现场三 · 哪一版才是最后的通知",
      "description": "纸档保留联络记录，电脑与手机留下不同画面。",
      "scene_key": "psych",
      "documents": [
        "psych-flow"
      ],
      "physical": [
        "psych-draft",
        "psych-chat"
      ]
    },
    {
      "id": "martial",
      "name": "舞台动作排练区",
      "club": "武术社",
      "eyebrow": "现场四 · 画面与说法是否一致",
      "description": "对照现场纸档，检查原片场记和后台工作照。",
      "scene_key": "martial",
      "documents": [
        "martial-statement"
      ],
      "physical": [
        "martial-video",
        "martial-photo"
      ]
    }
  ],
  "IDENTITIES": {
    "observer": {
      "name": "观察者",
      "english": "OBSERVER",
      "description": "你把细节留在记录里，让被忽略的事实重新出现。三类身份平等，卡片随机发放。",
      "prompt": "在决定相信谁之前，先问一句：这条信息从哪里来？",
      "questions": [
        "哪些是原始记录，哪些是事后整理或转述？",
        "一条孤立的细节，经过哪些相互独立的材料才能成为证据？",
        "如果删去你最相信的那份材料，你的结论还站得住吗？"
      ],
      "color": "#c3c9d2"
    },
    "questioner": {
      "name": "质询者",
      "english": "QUESTIONER",
      "description": "你追问说法之间的空白，让每个结论都交代自己的依据。三类身份平等，卡片随机发放。",
      "prompt": "面对“我只是做了这一点”，继续追问他当时知道什么。",
      "questions": [
        "“我没有希望这个结果”能否回答“我明知风险仍做了什么”？",
        "哪一句看似确定的说法，实际上缺少一份最关键的原始记录？",
        "调查发起者提供的信息，是否也应接受同样严格的核对？"
      ],
      "color": "#a6aebc"
    },
    "judge": {
      "name": "裁决者",
      "english": "JUDGE",
      "description": "你在事实厘清之后作出判断，也为判断保留可追问的理由。三类身份平等，卡片随机发放。",
      "prompt": "承担责任不能靠排队替代，也不能靠一句共同有错就此结束。",
      "questions": [
        "直接实施、提供条件、推动执行与事后掩盖，应怎样分别评价？",
        "一个人先前遭受的不公，能解释其行动到哪一步？",
        "主动重启调查是否改变责任？它能改变哪些部分，又不能抹去哪些事实？"
      ],
      "color": "#e1e4ea"
    }
  },
  "EVIDENCE": {
    "theatre-report": {
      "id": "theatre-report",
      "kind": "document",
      "location_id": "theatre",
      "required": true,
      "hidden": false,
      "tag": "初步说法",
      "title": "演出与事故档案",
      "subtitle": "《笼中鸟》首演 · 10月18日",
      "read_mode": "paper",
      "summary": "事故、检验、排练、申报与会议五份文书。",
      "sections": [
        "01 首演工作登记与事故初报",
        "02 封存送检及结果回执",
        "03 排练意见记录及文本核验",
        "04 项目申报附件及来源核对表",
        "05 主创会议记录及材料收文目录"
      ],
      "page_count": 5,
      "archive_no": "T-01",
      "file_no": "T-01",
      "source": "演出组、封存检验及项目会议留档",
      "formed_at": "10月18日及事后检验",
      "takeaways": [
        "事故初报与检验回执。",
        "排练备忘、作品来源与会议原始记录。"
      ]
    },
    "bio-register": {
      "id": "bio-register",
      "kind": "document",
      "location_id": "bio",
      "required": true,
      "hidden": false,
      "tag": "转交起点",
      "title": "材料流转档案",
      "subtitle": "联合项目材料库 · 10月18日",
      "read_mode": "paper",
      "summary": "领用、交接、变更、限制确认与清点五份文书。",
      "sections": [
        "01 材料领用登记表",
        "02 材料交接签收单留底",
        "03 用途变更登记及补记核查表",
        "04 使用限制与阅读确认表",
        "05 库内清点及流转附件目录"
      ],
      "page_count": 5,
      "archive_no": "B-01",
      "file_no": "B-01",
      "source": "材料室领用表、签收联及清点留底",
      "formed_at": "10月18日16:00—17:35",
      "takeaways": [
        "逐项核对领用、签收与更正手续。",
        "限制确认与清点记录分别留存。"
      ]
    },
    "psych-flow": {
      "id": "psych-flow",
      "kind": "document",
      "location_id": "psych",
      "required": true,
      "hidden": false,
      "tag": "流程恢复",
      "title": "演出联络档案",
      "subtitle": "联合项目工作账号 · 10月18日",
      "read_mode": "paper",
      "summary": "流程发布、技术回执、草稿与收件五份文书。",
      "sections": [
        "01 演出流程发布台账",
        "02 技术事项往来与值班回执",
        "03 工作草稿与发布依据登记",
        "04 流程版本接收登记表",
        "05 值班材料核对与归卷移交表"
      ],
      "page_count": 5,
      "archive_no": "S-01",
      "file_no": "S-01",
      "source": "流程发布台账、值班回执及版本归档记录",
      "formed_at": "10月18日16:48—19:30及事后归档",
      "takeaways": [
        "发布、技术回复与草稿分开核对。",
        "按版本查收件人和接收时间。"
      ]
    },
    "martial-statement": {
      "id": "martial-statement",
      "kind": "document",
      "location_id": "martial",
      "required": true,
      "hidden": false,
      "tag": "待核实证词",
      "title": "行踪说明档案",
      "subtitle": "本人陈述及附件收件记录 · 10月18日",
      "read_mode": "paper",
      "summary": "行踪说明、附件收件与补充口述五份文书。",
      "sections": [
        "01 本人行踪说明收件单",
        "02 随附文件收件与载体登记表",
        "03 影像来源调取与交接目录",
        "04 22:05补充口述收录单",
        "05 说明更正与卷内归档登记"
      ],
      "page_count": 5,
      "archive_no": "M-01",
      "file_no": "M-01",
      "source": "本人说明、素材调取与更正归卷留底",
      "formed_at": "10月18日20:22—22:05及后续归卷",
      "takeaways": [
        "区分本人陈述、文件导出和原始素材。",
        "首次说明与补充口述并列核对。"
      ]
    },
    "theatre-script": {
      "id": "theatre-script",
      "kind": "physical",
      "location_id": "theatre",
      "required": false,
      "hidden": false,
      "tag": "作品来源",
      "title": "两本剧本",
      "subtitle": "工作台留存",
      "caption": "两份薄册纸张新旧不同，第四幕的标记位置却相似。",
      "detail_tags": [
        "新旧版本",
        "同一幕标记"
      ],
      "alt": "工作台上的两本装订剧本，一本纸张旧暗，一本较新，均有批注标记。",
      "image_labels": [
        {
          "text": "往届留档",
          "x": 25,
          "y": 27
        },
        {
          "text": "本届申报",
          "x": 74,
          "y": 23
        }
      ],
      "image_url": "./assets/evidence/theatre-script.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "T-02",
      "source": "话剧社留档与本届申报封套",
      "recorded_at": "演前留存，10月18日登记",
      "authenticity_note": "封面及标记可见；来源与内容以纸档核对。"
    },
    "theatre-rig": {
      "id": "theatre-rig",
      "kind": "physical",
      "location_id": "theatre",
      "required": true,
      "hidden": false,
      "tag": "装置异常",
      "title": "连接环",
      "subtitle": "封存物近照",
      "caption": "连接处留有一片集中的新痕，旁侧旧磨损较浅。",
      "detail_tags": [
        "局部新痕",
        "旧磨损"
      ],
      "alt": "封存的银灰舞台连接环特写，连接部位有集中损伤，周围留有旧磨痕。",
      "image_labels": [],
      "image_url": "./assets/evidence/theatre-rig.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "T-03",
      "source": "封存部件照片与检查记录",
      "recorded_at": "10月18日19:52封存，事后拍摄",
      "authenticity_note": "图片显示外观；材料及损伤判断以检查摘录为准。"
    },
    "bio-handoff": {
      "id": "bio-handoff",
      "kind": "physical",
      "location_id": "bio",
      "required": true,
      "hidden": false,
      "tag": "材料去向",
      "title": "空周转袋",
      "subtitle": "材料室工作台",
      "caption": "袋中已空，原先固定签收联的位置只剩一道撕口。",
      "detail_tags": [
        "空袋",
        "签收联缺失"
      ],
      "alt": "黑灰半透明材料周转袋，内容物已取走，封口处的纸签收联被撕下。",
      "image_labels": [
        {
          "text": "L-17",
          "x": 51,
          "y": 72
        }
      ],
      "image_url": "./assets/evidence/bio-handoff.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "B-02",
      "source": "材料室工作台周转袋",
      "recorded_at": "10月18日17:26交接后留存",
      "authenticity_note": "袋口与纸联可对照；文字以交接抄录为准。"
    },
    "bio-label": {
      "id": "bio-label",
      "kind": "physical",
      "location_id": "bio",
      "required": false,
      "hidden": false,
      "tag": "编号对照",
      "title": "破损外包装",
      "subtitle": "待清理周转箱",
      "caption": "外包装保留同一编号；断开的纸联可与袋口撕边对照。",
      "detail_tags": [
        "同一编号",
        "撕边对照"
      ],
      "alt": "材料室留存的破损外包装，旁边有被撕下的纸联，纸边形状清楚可见。",
      "image_labels": [
        {
          "text": "L-17",
          "x": 38,
          "y": 69
        }
      ],
      "image_url": "./assets/evidence/bio-label.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "B-03",
      "source": "材料室待清理周转箱",
      "recorded_at": "10月18日17:35清点后留存",
      "authenticity_note": "编号及撕边供核对，包装本身不证明具体用途。"
    },
    "psych-draft": {
      "id": "psych-draft",
      "kind": "physical",
      "location_id": "psych",
      "required": false,
      "hidden": false,
      "tag": "措辞修改",
      "title": "通知修订画面",
      "subtitle": "联络电脑",
      "caption": "同一份流程的状态，先后留下两种不同表述。",
      "detail_tags": [
        "状态变更",
        "修订痕迹"
      ],
      "alt": "联络电脑中的流程表修订画面，两个简洁状态区域呈现前后的修改。",
      "image_labels": [
        {
          "text": "待核实",
          "x": 50,
          "y": 40
        },
        {
          "text": "复检通过",
          "x": 50,
          "y": 58
        }
      ],
      "image_url": "./assets/evidence/psych-draft.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "S-02",
      "source": "项目联络电脑保存的草稿",
      "recorded_at": "10月18日18:04—18:08",
      "authenticity_note": "画面记录修订状态；正式发布与接收回执另见纸档。"
    },
    "psych-chat": {
      "id": "psych-chat",
      "kind": "physical",
      "location_id": "psych",
      "required": true,
      "hidden": false,
      "tag": "知情记录",
      "title": "联络手机",
      "subtitle": "工作账号片段",
      "caption": "屏幕留下两条关键回复，可与技术回执及发布台账核对。",
      "detail_tags": [
        "通讯片段",
        "消息顺序"
      ],
      "alt": "深色联络手机的消息界面，屏幕上有两条相邻的简短对话气泡。",
      "image_labels": [
        {
          "text": "没有复检",
          "x": 47,
          "y": 33
        },
        {
          "text": "恢复威亚",
          "x": 53,
          "y": 50
        }
      ],
      "image_url": "./assets/evidence/psych-chat.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "S-03",
      "source": "项目工作账号通讯片段",
      "recorded_at": "10月18日17:52—18:12",
      "authenticity_note": "画面为通讯节选；独立技术回执与发布台账另见纸档。"
    },
    "martial-video": {
      "id": "martial-video",
      "kind": "physical",
      "location_id": "martial",
      "required": false,
      "hidden": false,
      "tag": "拍摄日期",
      "title": "训练原片",
      "subtitle": "相机回放画面",
      "caption": "原片开头还保留着场记板，日期早于首演一天。",
      "detail_tags": [
        "原始场记",
        "拍摄日期"
      ],
      "alt": "相机回放训练片段，画面中的场记板清楚可见，人物仅为模糊剪影。",
      "image_labels": [
        {
          "text": "10月17日",
          "x": 49,
          "y": 56
        }
      ],
      "image_url": "./assets/evidence/martial-video.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "M-02",
      "source": "排练区相机原始素材",
      "recorded_at": "10月17日17:36—17:46",
      "authenticity_note": "场记标明拍摄日期；不能证明次日连续行踪。"
    },
    "martial-photo": {
      "id": "martial-photo",
      "kind": "physical",
      "location_id": "martial",
      "required": true,
      "hidden": false,
      "tag": "行踪交叉核对",
      "title": "后台工作照",
      "subtitle": "当晚共享相册",
      "caption": "一个持材料包的人影出现在第四幕设备区域。",
      "detail_tags": [
        "当日后台",
        "材料包"
      ],
      "alt": "首演当晚的剧场后台，一个模糊男性人影拿着材料包，靠近舞台连接设备区域。",
      "image_labels": [
        {
          "text": "10月18日 17:40",
          "x": 72,
          "y": 88
        }
      ],
      "image_url": "./assets/evidence/martial-photo.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "M-03",
      "source": "布场共享相册原图",
      "recorded_at": "10月18日17:38—17:42",
      "authenticity_note": "相册原图用于核对后台活动，不能单独说明全部经过。"
    },
    "debate-draft": {
      "id": "debate-draft",
      "kind": "physical",
      "location_id": "theatre",
      "required": false,
      "hidden": true,
      "tag": "被删去的来源",
      "title": "删改的来源栏",
      "subtitle": "额外发现",
      "caption": "来源栏被划去；页边的修改批注署名为陈序。",
      "detail_tags": [
        "来源删改",
        "陈序批注"
      ],
      "alt": "旧申报纸页的局部，来源栏被划去，旁边有一处手写批注。",
      "image_labels": [
        {
          "text": "来源",
          "x": 30,
          "y": 43
        },
        {
          "text": "陈序",
          "x": 68,
          "y": 70
        }
      ],
      "image_url": "./assets/evidence/theatre-script.webp",
      "content": [],
      "observation": "",
      "read_mode": "visual",
      "file_no": "D-01",
      "source": "申报封套中保留的带批注旧稿",
      "recorded_at": "10月18日15:20打印，21:02修订留痕",
      "authenticity_note": "画面显示来源栏局部；完整批注见隐藏附页。"
    }
  },
  "REQUIRED_EVIDENCE": [
    "bio-handoff",
    "bio-register",
    "martial-photo",
    "martial-statement",
    "psych-chat",
    "psych-flow",
    "theatre-report",
    "theatre-rig"
  ],
  "INFERENCE_QUESTIONS": [
    {
      "id": "cause",
      "title": "第四幕为什么会发生事故？",
      "hints": [
        "把话剧社的检查结论，与心理社的流程和复检回执放在一起看。",
        "检查结论说明装置遭到什么影响；流程记录说明它在什么条件下再次被使用。"
      ],
      "options": [
        {
          "id": "natural_wear",
          "label": "连接部件自然老化，演前没有人发现或改变设备状态。"
        },
        {
          "id": "human_action",
          "label": "装置遭到违规干预，随后在未经专业复检的情况下恢复使用，最终失效。"
        },
        {
          "id": "self_arranged",
          "label": "林知夏通过第四幕演出，主动安排了自己的死亡。"
        },
        {
          "id": "unforeseen",
          "label": "装置未受人为影响，事故属于事先无法发现的偶发故障。"
        }
      ]
    },
    {
      "id": "chain",
      "title": "三个人的行动，怎样连在一起？",
      "hints": [
        "先从材料领用和交接入手，再核对后台画面与流程发布记录。",
        "分别核对交出材料的人、接触装置的人，以及发布恢复通知的人。"
      ],
      "options": [
        {
          "id": "chen_direct",
          "label": "陈序直接干预装置；陆远、赵天宇和苏蔓在事故后才知情。"
        },
        {
          "id": "su_lu_zhao",
          "label": "苏蔓交出材料，陆远干预装置，赵天宇发布复检通过的通知。"
        },
        {
          "id": "lu_zhao_su",
          "label": "陆远交出限用材料，赵天宇违规干预装置，苏蔓宣称复检通过并恢复威亚。"
        },
        {
          "id": "lin_alone",
          "label": "林知夏独自安排了材料、装置和流程变更，其他人没有参与。"
        }
      ]
    },
    {
      "id": "proof",
      "title": "怎样确认苏蔓在发通知前已知道风险、也知道尚未复检？",
      "hints": [
        "先找通知发出前的消息，再核对技术值班回执和正式发布记录。",
        "消息说明她获知了什么，回执说明复检是否发生，流程记录说明她随后发布了什么。"
      ],
      "options": [
        {
          "id": "psychological_test",
          "label": "根据她的专业和当时情绪，推测她应该了解风险。"
        },
        {
          "id": "single_photo",
          "label": "只看赵天宇出现在后台的工作照。"
        },
        {
          "id": "red_script",
          "label": "只看剧本上被红笔标出的台词。"
        },
        {
          "id": "messages_and_flow",
          "label": "把联络设备中的消息，与纸档中的复检回执、两版流程发布记录相互核对。"
        }
      ]
    }
  ],
  "RESPONSIBILITY_QUESTION": {
    "id": "responsibility",
    "title": "事实厘清后，你更倾向怎样分配责任？",
    "options": [
      {
        "id": "zhao",
        "label": "更看重直接干预装置的行动，认为赵天宇应承担更大责任。"
      },
      {
        "id": "su",
        "label": "更看重明知风险仍恢复威亚的决定，认为苏蔓应承担更大责任。"
      },
      {
        "id": "lu",
        "label": "更看重明知禁用范围仍交出材料、改写记录，认为陆远应承担更大责任。"
      },
      {
        "id": "chen",
        "label": "更看重包装作品来源及删改事故背景的行为，认为陈序应承担更大责任。"
      },
      {
        "id": "shared",
        "label": "应分别评价每个人的行动、知情程度与退出机会，责任不能只归于一人。"
      }
    ]
  },
  "INFERENCE_ANSWERS": {
    "cause": "human_action",
    "chain": "lu_zhao_su",
    "proof": "messages_and_flow"
  },
  "SOLUTION": {
    "title": "第四幕之后：完整证据链",
    "summary": "连接部件遭到新近人为干预；陆远知道材料限制及上人的风险，仍向赵天宇交接并改写记录；赵接触装置后称原想停演，认为当晚使用地面方案；苏蔓收到风险提示和负责复检人员未检查的回复，仍发布复检通过的通知，恢复威亚动作。三人的行动与19:40事故相连；现有记录不足以完整判断各人对死亡结果的心理态度，本案不作法律罪名认定。陈序的包装与删改需要另行追问。",
    "chain": [
      {
        "title": "一、先核对“意外”的依据",
        "body": "话剧社纸档中的21:10事故说明只是初稿，自然老化是暂填说法，所称复检未附具名签字。线上连接环照片显示局部新痕；纸档的独立检验摘录确认承载失效来自演前新近干预，并记载残留与L-17留样特征一致。外观、检验和流转记录分别证明不同事项，照片本身不能确定接触者或精确的干预时间。",
        "evidence_ids": [
          "theatre-report",
          "theatre-rig"
        ]
      },
      {
        "title": "二、材料从陆远手中交给赵天宇",
        "body": "空周转袋与破损外包装可核对编号和撕联形态。生物社纸档保存的领用与签收抄录则交代了去向：17:12陆远领出L-17，17:26双方签收。陆远明知承力部位存在坠落风险仍完成交接，17:31又改写用途。具体行动须由原物与文字记录互相印证。",
        "evidence_ids": [
          "bio-register",
          "bio-handoff",
          "bio-label"
        ]
      },
      {
        "title": "三、照片、交接与对话共同指向赵天宇",
        "body": "武术社纸档保留赵天宇所称当晚全程在排练区的自述，线上训练原片的10月17日场记与之不符；文件在10月18日重新导出，并不等于当天拍摄。后台照片、双方交接留底、心理社风险转达登记，以及连接部件残留的特征比对相互印证，共同支持赵实施了违规干预；单张照片不显示具体操作，也不足以说明全部经过。22:05补充口述中，他承认原行踪说法不实，并称原想以设备异常迫使整场停演、仍以为当晚执行地面版。这一事后自辩须另行核对，现有记录不足以确认他演前知道恢复威亚，也不足以完整判断他对死亡结果的心理态度。",
        "evidence_ids": [
          "martial-statement",
          "martial-photo",
          "bio-handoff",
          "psych-chat",
          "theatre-rig",
          "martial-video"
        ]
      },
      {
        "title": "四、苏蔓明知未复检，仍恢复威亚动作",
        "body": "心理社纸档的风险转达登记说明苏蔓在17:52已收到承力处及坠落风险提示；18:06技术值班回执明确设备尚未检查、不能签通过。线上手机片段与电脑修订画面显示通知中的矛盾，再由纸档发布台账核对：17:00原为地面版，苏蔓于18:12改回威亚动作，林知夏18:16回复收到。她18:08的发布考虑提及比赛名额和赵的空载说法，但空载无事不能代替承重安全检查。现有接收记录不显示赵、陆演前读到恢复版，不能据此认定他们知道这一变更。",
        "evidence_ids": [
          "psych-flow",
          "psych-chat",
          "psych-draft"
        ]
      },
      {
        "title": "五、共同获利的旧项目，成为冲突的背景",
        "body": "旧剧本与本届原创申报矛盾，项目组对作品来源、主创署名与资源份额存在争议。红笔句子本就是旧作台词，另有表演批注；林知夏提出地面方案，不能将这句话当成自杀遗书。申报问题应根据具体材料评价，不能由署名争议推定她胁迫他人，也不能用争议替代对事故原因的调查。",
        "evidence_ids": [
          "theatre-report",
          "theatre-script",
          "psych-flow"
        ]
      },
      {
        "title": "六、隐藏线：调查发起者同样要接受追问",
        "body": "带批注旧稿显示陈序曾主动建议删除作品来源，事故说明底稿又删去了署名和资源争执。他的责任涉及包装与掩盖；没有证据据此推定他参与装置破坏。主动发起复核可以纳入评价，却不能让此前的删改自动消失。本段是隐藏补充，不影响正常结案与领奖。",
        "evidence_ids": [
          "debate-draft",
          "theatre-report",
          "theatre-script"
        ]
      }
    ],
    "discussion": [
      "当每个人都说“我只做了其中一件事”时，应根据行动、知情程度和可选择的退出机会，怎样分别承担责任？",
      "直接实施破坏的人，与明知危险仍恢复流程的人，谁应承担更大责任？请说明判断标准，而不只投出一个名字。",
      "陆远写下过风险警告，却仍然交出材料、修改记录。提醒过他人是否足以减轻其责任？",
      "陈序重启调查，使真相有机会被看见；这能改变我们对他的哪些评价，又有哪些事实不能被抵消？",
      "在事实证据仍不完整时，怎样提出合理怀疑，同时避免把猜测写成已经发生的事？"
    ]
  }
};

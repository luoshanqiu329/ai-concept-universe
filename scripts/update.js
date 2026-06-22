#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const VERSION_DIR = path.join(DATA_DIR, "versions");
const CONCEPTS_PATH = path.join(DATA_DIR, "concepts.json");
const INDEX_PATH = path.join(ROOT, "index.html");
const CURRENT_YEAR = 2026;

const EXTRA_CONCEPTS = [
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    aliases: ["AI", "人工智能", "机器智能"],
    category: "基座模型",
    heat: 96,
    first_appear: "1956",
    origin: "Dartmouth Workshop 将人工智能确立为研究领域名称",
    maturity: "基础学科",
    definition: "研究和构建能够感知、推理、学习、规划与行动的机器系统的学科与技术总称。",
    relations: [
      { target: "turing-test", type: "derives" },
      { target: "neural-network", type: "contains" },
      { target: "deep-learning", type: "contains" },
    ],
    references: [{ label: "Dartmouth proposal", url: "https://raysolomonoff.com/dartmouth/boxa/dart564props.pdf" }],
  },
  {
    id: "turing-test",
    name: "Turing Test",
    aliases: ["图灵测试", "Imitation Game", "机器能否思考"],
    category: "AI安全与对齐",
    heat: 78,
    first_appear: "1950",
    origin: "Alan Turing 在 Computing Machinery and Intelligence 中提出",
    maturity: "经典思想实验",
    definition: "用对话中人类是否能区分机器与人的方式，讨论机器智能是否成立的经典测试。",
    relations: [
      { target: "artificial-intelligence", type: "derives" },
      { target: "alan-turing", type: "person" },
    ],
    references: [{ label: "Stanford Encyclopedia", url: "https://plato.stanford.edu/entries/turing-test/" }],
  },
  {
    id: "neural-network",
    name: "Neural Network",
    aliases: ["神经网络", "Artificial Neural Network", "ANN"],
    category: "基座模型",
    heat: 88,
    first_appear: "1943",
    origin: "早期神经元模型和联结主义研究逐步形成",
    maturity: "基础技术",
    definition: "由多层可学习参数单元组成的计算模型，是深度学习和现代大模型的基础结构。",
    relations: [
      { target: "deep-learning", type: "contains" },
      { target: "backpropagation", type: "optimizes" },
    ],
  },
  {
    id: "backpropagation",
    name: "Backpropagation",
    aliases: ["反向传播", "反传", "Backprop"],
    category: "微调技术",
    heat: 84,
    first_appear: "1986",
    origin: "Rumelhart、Hinton、Williams 等人推动其在神经网络训练中普及",
    maturity: "基础算法",
    definition: "通过链式法则把误差信号从输出层传回各层，用于高效训练神经网络参数。",
    relations: [
      { target: "neural-network", type: "optimizes" },
      { target: "deep-learning", type: "contains" },
      { target: "geoffrey-hinton", type: "person" },
    ],
    references: [{ label: "Backpropagation paper", url: "https://www.nature.com/articles/323533a0" }],
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    aliases: ["深度学习", "Deep Neural Network", "DNN"],
    category: "基座模型",
    heat: 95,
    first_appear: "2006",
    origin: "Hinton、Bengio、LeCun 等人推动神经网络复兴",
    maturity: "基础技术",
    definition: "用多层神经网络从数据中自动学习表示，是现代视觉、语音、语言模型的核心技术路线。",
    relations: [
      { target: "neural-network", type: "derives" },
      { target: "backpropagation", type: "applies" },
      { target: "large-language-model", type: "contains" },
    ],
    references: [{ label: "Deep learning review", url: "https://www.nature.com/articles/nature14539" }],
  },
  {
    id: "recurrent-neural-network",
    name: "Recurrent Neural Network",
    aliases: ["RNN", "循环神经网络", "Recurrent Network"],
    category: "基座模型",
    heat: 70,
    first_appear: "1986",
    origin: "为序列数据建模而形成的神经网络结构",
    maturity: "经典架构",
    definition: "通过循环连接处理序列状态的神经网络，是 LSTM、GRU 等早期语言和语音模型的基础。",
    relations: [
      { target: "neural-network", type: "derives" },
      { target: "lstm", type: "contains" },
    ],
  },
  {
    id: "lstm",
    name: "LSTM",
    aliases: ["Long Short-Term Memory", "长短期记忆网络", "长短期记忆"],
    category: "基座模型",
    heat: 72,
    first_appear: "1997",
    origin: "Sepp Hochreiter 与 Jurgen Schmidhuber 提出",
    maturity: "经典架构",
    definition: "通过门控机制缓解长序列训练中的梯度消失问题，是 Transformer 前重要的序列建模架构。",
    relations: [
      { target: "recurrent-neural-network", type: "derives" },
      { target: "deep-learning", type: "applies" },
    ],
    references: [{ label: "LSTM paper", url: "https://www.bioinf.jku.at/publications/older/2604.pdf" }],
  },
  {
    id: "gan",
    name: "GAN",
    aliases: ["Generative Adversarial Network", "生成对抗网络"],
    category: "多模态技术",
    heat: 80,
    first_appear: "2014",
    origin: "Ian Goodfellow 等人提出生成对抗网络",
    maturity: "经典生成模型",
    definition: "让生成器和判别器相互博弈来学习数据分布的生成模型，推动了图像生成研究。",
    relations: [
      { target: "deep-learning", type: "derives" },
      { target: "diffusion-model", type: "derives" },
    ],
    references: [{ label: "GAN paper", url: "https://arxiv.org/abs/1406.2661" }],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    aliases: ["ChatGPT", "聊天式 AI", "对话式 AI"],
    category: "行业应用场景",
    heat: 98,
    first_appear: "2022-11",
    origin: "OpenAI 发布的对话式 AI 产品",
    maturity: "规模化商用",
    definition: "基于 GPT 系列模型的对话式 AI 产品，使大模型从研究与 API 走向大众用户。",
    relations: [
      { target: "gpt", type: "derives" },
      { target: "rlhf", type: "applies" },
      { target: "openai", type: "company" },
    ],
    references: [{ label: "ChatGPT announcement", url: "https://openai.com/index/chatgpt/" }],
  },
  {
    id: "skills",
    name: "Skills",
    category: "Agent协议与范式",
    heat: 88,
    first_appear: "2025-10",
    origin: "Anthropic 在 Claude/Claude Code 中产品化的可复用能力包范式",
    maturity: "快速落地",
    definition: "把特定任务的指令、脚本和资源封装成可复用能力，让智能体按需加载并完成专业任务。",
    relations: [
      { target: "ai-agent", type: "applies" },
      { target: "claude-code", type: "applies" },
      { target: "agent-memory", type: "optimizes" },
    ],
    references: [{ label: "Anthropic Skills", url: "https://docs.anthropic.com/en/docs/claude-code/skills" }],
  },
  {
    id: "agent-loop",
    name: "Loop",
    category: "Agent协议与范式",
    heat: 84,
    first_appear: "2023-03",
    origin: "AutoGPT/BabyAGI 等自主智能体实践把计划、行动、观察、反思循环产品化",
    maturity: "工程常用",
    definition: "智能体在目标驱动下反复经历规划、工具调用、观察结果和自我修正的执行循环。",
    relations: [
      { target: "ai-agent", type: "contains" },
      { target: "planning-agent", type: "contains" },
      { target: "reflexion", type: "optimizes" },
    ],
  },
  {
    id: "workflow",
    name: "Workflow",
    aliases: ["工作流", "AI Workflow", "Agent Workflow", "流程"],
    category: "Agent协议与范式",
    heat: 86,
    first_appear: "2023-03",
    origin: "AI Agent 工程实践把任务拆解、工具调用和状态流转组织成可复用流程",
    maturity: "产业实践",
    definition: "把目标、步骤、状态、工具和人工节点组织起来，让 AI 系统按流程完成复杂任务的执行结构。",
    relations: [
      { target: "ai-agent", type: "contains" },
      { target: "tool-use", type: "contains" },
      { target: "agent-loop", type: "contains" },
    ],
    references: [{ label: "LangGraph Workflows", url: "https://docs.langchain.com/oss/python/langgraph/workflows-agents" }],
  },
  {
    id: "agentic-workflow",
    name: "Agentic Workflow",
    aliases: ["智能体工作流", "Agent 工作流", "Agentic Workflows"],
    category: "Agent协议与范式",
    heat: 85,
    first_appear: "2024-02",
    origin: "RAG、工具调用和多步骤 Agent 产品化后形成的工作流范式",
    maturity: "产业实践",
    definition: "由智能体根据目标动态规划步骤、选择工具并根据反馈调整路径的工作流形态。",
    relations: [
      { target: "workflow", type: "derives" },
      { target: "ai-agent", type: "applies" },
      { target: "planning-agent", type: "contains" },
    ],
    references: [{ label: "LangGraph Agents", url: "https://docs.langchain.com/oss/python/langgraph/workflows-agents" }],
  },
  {
    id: "workflow-orchestration",
    name: "Workflow Orchestration",
    aliases: ["工作流编排", "编排", "Orchestration", "Agent Orchestration"],
    category: "Agent协议与范式",
    heat: 82,
    first_appear: "2023-06",
    origin: "企业自动化、Agent 框架和多工具调用系统共同推动",
    maturity: "工程常用",
    definition: "负责安排多步骤任务、工具、模型、状态和分支条件的调度与控制层。",
    relations: [
      { target: "workflow", type: "contains" },
      { target: "agentic-workflow", type: "optimizes" },
      { target: "multi-agent-system", type: "applies" },
    ],
    references: [{ label: "OpenAI Agents SDK", url: "https://openai.github.io/openai-agents-python/" }],
  },
  {
    id: "agent-hook",
    name: "Agent Hook",
    aliases: ["Hook", "Hooks", "hook", "hooks", "钩子", "生命周期钩子", "Lifecycle Hook", "Agent Lifecycle Hook"],
    category: "Agent协议与范式",
    heat: 78,
    first_appear: "2024-09",
    origin: "Agent 框架和 Claude Code 等产品把执行生命周期开放给用户自定义逻辑",
    maturity: "工程常用",
    definition: "在智能体执行前后、工具调用前后或状态变化时插入自定义逻辑的生命周期扩展点。",
    relations: [
      { target: "workflow-orchestration", type: "applies" },
      { target: "tool-use", type: "applies" },
      { target: "guardrails", type: "optimizes" },
    ],
    references: [{ label: "Claude Code Hooks", url: "https://docs.anthropic.com/en/docs/claude-code/hooks" }],
  },
  {
    id: "webhook",
    name: "Webhook",
    aliases: ["web hook", "Web Hook", "事件回调", "回调通知"],
    category: "开发框架与工具",
    heat: 72,
    first_appear: "2007",
    origin: "Web API 生态中形成的事件驱动集成机制，被 Agent 和自动化工作流复用",
    maturity: "成熟基础设施",
    definition: "当外部事件发生时由系统主动向指定地址发送通知，用于触发自动化流程或智能体任务。",
    relations: [
      { target: "trigger", type: "contains" },
      { target: "workflow", type: "applies" },
      { target: "mcp", type: "applies" },
    ],
    references: [{ label: "GitHub Webhooks", url: "https://docs.github.com/en/webhooks/about-webhooks" }],
  },
  {
    id: "trigger",
    name: "Trigger",
    aliases: ["触发器", "事件触发", "Event Trigger", "Trigger Node"],
    category: "Agent协议与范式",
    heat: 75,
    first_appear: "2023-05",
    origin: "自动化平台和 Agent 工作流把事件、时间、消息、文件变更抽象成启动条件",
    maturity: "工程常用",
    definition: "启动工作流或智能体任务的条件，可以来自时间、事件、消息、API 回调或人工操作。",
    relations: [
      { target: "workflow", type: "contains" },
      { target: "webhook", type: "applies" },
      { target: "agent-loop", type: "applies" },
    ],
  },
  {
    id: "agent-handoff",
    name: "Handoff",
    aliases: ["Agent Handoff", "任务交接", "智能体交接", "handoffs"],
    category: "Agent协议与范式",
    heat: 76,
    first_appear: "2024-10",
    origin: "多智能体系统和客服/编程 Agent 框架把任务转交抽象成标准能力",
    maturity: "工程常用",
    definition: "一个智能体把任务、上下文和控制权转交给另一个更合适智能体或人工角色的机制。",
    relations: [
      { target: "multi-agent-system", type: "contains" },
      { target: "workflow-orchestration", type: "applies" },
      { target: "human-in-the-loop", type: "applies" },
    ],
    references: [{ label: "OpenAI Agents Handoffs", url: "https://openai.github.io/openai-agents-python/handoffs/" }],
  },
  {
    id: "human-in-the-loop",
    name: "Human-in-the-loop",
    aliases: ["HITL", "人在回路", "人工介入", "Human Review", "人工审批"],
    category: "AI安全与对齐",
    heat: 79,
    first_appear: "2023-08",
    origin: "高风险 Agent 应用需要在关键步骤引入人工审批、纠错和责任确认",
    maturity: "产业实践",
    definition: "在智能体执行过程中保留人工审批、确认、编辑或接管环节，降低错误执行风险。",
    relations: [
      { target: "workflow", type: "contains" },
      { target: "guardrails", type: "optimizes" },
      { target: "agent-handoff", type: "applies" },
    ],
    references: [{ label: "LangGraph Human-in-the-loop", url: "https://docs.langchain.com/oss/python/langgraph/human-in-the-loop" }],
  },
  {
    id: "durable-execution",
    name: "Durable Execution",
    aliases: ["持久执行", "断点恢复", "Checkpointing", "任务恢复"],
    category: "Agent协议与范式",
    heat: 77,
    first_appear: "2024-01",
    origin: "长任务 Agent 需要在失败、等待人工、重启后继续执行",
    maturity: "工程常用",
    definition: "让长流程智能体在中断、失败或人工等待后保存状态并从检查点继续执行的能力。",
    relations: [
      { target: "workflow-orchestration", type: "optimizes" },
      { target: "agent-memory", type: "applies" },
      { target: "human-in-the-loop", type: "applies" },
    ],
    references: [{ label: "LangGraph Durable Execution", url: "https://docs.langchain.com/oss/python/langgraph/durable-execution" }],
  },
  {
    id: "agent-tracing",
    name: "Agent Tracing",
    aliases: ["Tracing", "Trace", "轨迹追踪", "执行追踪", "可观测性", "Observability"],
    category: "开发框架与工具",
    heat: 78,
    first_appear: "2024-03",
    origin: "复杂 Agent 系统需要记录模型调用、工具调用、状态变化和错误路径",
    maturity: "工程常用",
    definition: "记录智能体每一步推理、工具调用、输入输出和状态变化，用于调试、评估和审计。",
    relations: [
      { target: "workflow-orchestration", type: "optimizes" },
      { target: "model-evaluation", type: "applies" },
      { target: "guardrails", type: "applies" },
    ],
    references: [{ label: "OpenAI Agents Tracing", url: "https://openai.github.io/openai-agents-python/tracing/" }],
  },
  {
    id: "react",
    name: "ReAct",
    category: "Agent协议与范式",
    heat: 86,
    first_appear: "2022-10",
    origin: "Shunyu Yao 等人在 ReAct 论文中系统提出",
    maturity: "经典范式",
    definition: "把推理轨迹和外部行动交织起来，让语言模型边思考边调用工具完成任务。",
    relations: [
      { target: "chain-of-thought", type: "derives" },
      { target: "tool-use", type: "applies" },
      { target: "shunyu-yao", type: "person" },
    ],
    references: [{ label: "ReAct paper", url: "https://arxiv.org/abs/2210.03629" }],
  },
  {
    id: "mcp",
    name: "Model Context Protocol",
    category: "Agent协议与范式",
    heat: 91,
    first_appear: "2024-11",
    origin: "Anthropic 发布的开放协议",
    maturity: "生态扩张",
    definition: "用于把模型、工具、数据源和上下文连接起来的开放协议，常被称为 AI 应用的 USB-C。",
    relations: [
      { target: "tool-use", type: "applies" },
      { target: "ai-agent", type: "optimizes" },
      { target: "anthropic", type: "company" },
    ],
    references: [{ label: "MCP announcement", url: "https://www.anthropic.com/news/model-context-protocol" }],
  },
  {
    id: "chain-of-thought",
    name: "Chain-of-Thought",
    category: "Agent协议与范式",
    heat: 90,
    first_appear: "2022-01",
    origin: "Google Research 等团队系统化研究",
    maturity: "经典推理方法",
    definition: "通过显式中间推理步骤提升模型在数学、逻辑和多步任务上的表现。",
    relations: [
      { target: "reasoning-model", type: "contains" },
      { target: "test-time-compute", type: "optimizes" },
    ],
    references: [{ label: "CoT paper", url: "https://arxiv.org/abs/2201.11903" }],
  },
  {
    id: "tree-of-thoughts",
    name: "Tree of Thoughts",
    category: "Agent协议与范式",
    heat: 76,
    first_appear: "2023-05",
    origin: "Princeton/Google DeepMind 研究者提出",
    maturity: "研究与实验",
    definition: "把模型推理展开成树状候选路径，并通过搜索和评估选择更优解。",
    relations: [
      { target: "chain-of-thought", type: "derives" },
      { target: "test-time-compute", type: "applies" },
    ],
  },
  {
    id: "reflexion",
    name: "Reflexion",
    category: "Agent协议与范式",
    heat: 75,
    first_appear: "2023-03",
    origin: "Northeastern/MIT 等团队研究的语言反馈强化范式",
    maturity: "研究与工程试验",
    definition: "让智能体基于语言化反馈总结失败经验，并在后续尝试中改进策略。",
    relations: [
      { target: "agent-loop", type: "optimizes" },
      { target: "agent-memory", type: "applies" },
    ],
  },
  {
    id: "self-refine",
    name: "Self-Refine",
    category: "Agent协议与范式",
    heat: 72,
    first_appear: "2023-03",
    origin: "CMU/Allen AI 等研究者提出",
    maturity: "研究与工程试验",
    definition: "模型生成初稿后自我反馈、自我修改，通过迭代提升输出质量。",
    relations: [
      { target: "chain-of-thought", type: "optimizes" },
      { target: "model-evaluation", type: "applies" },
    ],
  },
  {
    id: "toolformer",
    name: "Toolformer",
    category: "Agent协议与范式",
    heat: 73,
    first_appear: "2023-02",
    origin: "Meta AI 研究者提出",
    maturity: "研究范式",
    definition: "让语言模型通过自监督方式学会在合适时机调用外部工具。",
    relations: [
      { target: "tool-use", type: "derives" },
      { target: "function-calling", type: "applies" },
    ],
    references: [{ label: "Toolformer paper", url: "https://arxiv.org/abs/2302.04761" }],
  },
  {
    id: "autogpt",
    name: "AutoGPT",
    category: "智能体Agent",
    heat: 79,
    first_appear: "2023-03",
    origin: "开源社区推动的自主智能体项目",
    maturity: "早期原型",
    definition: "用 GPT 模型自主拆解目标、调用工具并循环执行任务的开源智能体代表。",
    relations: [
      { target: "agent-loop", type: "applies" },
      { target: "ai-agent", type: "derives" },
    ],
  },
  {
    id: "babyagi",
    name: "BabyAGI",
    category: "智能体Agent",
    heat: 67,
    first_appear: "2023-03",
    origin: "Yohei Nakajima 发起的任务驱动智能体实验",
    maturity: "早期原型",
    definition: "通过创建、排序和执行任务列表来探索自主智能体工作流的开源项目。",
    relations: [
      { target: "agent-loop", type: "applies" },
      { target: "planning-agent", type: "applies" },
    ],
  },
  {
    id: "voyager-agent",
    name: "Voyager",
    category: "智能体Agent",
    heat: 72,
    first_appear: "2023-05",
    origin: "NVIDIA/Caltech 等团队提出",
    maturity: "研究原型",
    definition: "在 Minecraft 中通过开放式探索、技能库和自我改进持续学习的具身智能体。",
    relations: [
      { target: "skills", type: "contains" },
      { target: "agent-memory", type: "applies" },
    ],
  },
  {
    id: "swe-agent",
    name: "SWE-agent",
    category: "智能体Agent",
    heat: 78,
    first_appear: "2024-04",
    origin: "Princeton NLP 等团队推动的软件工程智能体",
    maturity: "快速落地",
    definition: "面向真实代码仓库修复、测试和提交变更的软件工程智能体。",
    relations: [
      { target: "code-agent", type: "derives" },
      { target: "ai-coding", type: "applies" },
    ],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    category: "开发框架与工具",
    heat: 87,
    first_appear: "2025-02",
    origin: "Anthropic 推出的命令行与代理式编码工具",
    maturity: "产业落地",
    definition: "面向代码库理解、编辑、测试和自动化工程任务的代理式编程工具。",
    relations: [
      { target: "code-agent", type: "applies" },
      { target: "skills", type: "applies" },
      { target: "anthropic", type: "company" },
    ],
  },
  {
    id: "context-engineering",
    name: "Context Engineering",
    category: "RAG与检索",
    heat: 88,
    first_appear: "2025-06",
    origin: "Agent/RAG 工程实践中快速形成的系统方法",
    maturity: "产业实践",
    definition: "围绕上下文结构、工具状态、检索材料和任务记忆组织模型输入的工程方法。",
    relations: [
      { target: "long-context", type: "optimizes" },
      { target: "rag", type: "optimizes" },
      { target: "mcp", type: "applies" },
    ],
  },
  {
    id: "agentic-rag",
    name: "Agentic RAG",
    category: "RAG与检索",
    heat: 87,
    first_appear: "2024-03",
    origin: "RAG 与 Agent 工程融合形成的应用架构",
    maturity: "产业实践",
    definition: "由智能体主动规划检索、调用工具、验证证据并迭代回答的增强检索架构。",
    relations: [
      { target: "rag", type: "derives" },
      { target: "ai-agent", type: "applies" },
    ],
  },
  {
    id: "deep-research",
    name: "Deep Research",
    category: "智能体Agent",
    heat: 91,
    first_appear: "2025-01",
    origin: "OpenAI、Google、Perplexity 等产品化研究型智能体",
    maturity: "产业落地",
    definition: "面向多源检索、交叉验证和长报告生成的研究型智能体产品形态。",
    relations: [
      { target: "browser-agent", type: "applies" },
      { target: "agentic-rag", type: "applies" },
      { target: "openai", type: "company" },
    ],
  },
  {
    id: "deepseek-r1",
    name: "DeepSeek-R1",
    category: "基座模型",
    heat: 91,
    first_appear: "2025-01",
    origin: "DeepSeek 发布的开源推理模型",
    maturity: "产业与开源生态快速采用",
    definition: "通过强化学习和推理链能力出圈的开放推理模型，推动 reasoning model 成为全球热点。",
    relations: [
      { target: "reasoning-model", type: "derives" },
      { target: "deepseek", type: "company" },
      { target: "test-time-compute", type: "applies" },
    ],
    references: [
      { label: "DeepSeek-R1 release", url: "https://api-docs.deepseek.com/news/news250120" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" },
    ],
  },
  {
    id: "prompt-caching",
    name: "Prompt Caching",
    category: "推理优化",
    heat: 80,
    first_appear: "2024-07",
    origin: "Anthropic、OpenAI 等 API 服务推动",
    maturity: "产业落地",
    definition: "缓存重复上下文以降低长提示调用成本和延迟的推理优化机制。",
    relations: [
      { target: "long-context", type: "optimizes" },
      { target: "kv-cache", type: "derives" },
    ],
  },
  {
    id: "llm-os",
    name: "LLM OS",
    category: "Agent协议与范式",
    heat: 74,
    first_appear: "2023-03",
    origin: "Andrej Karpathy 等人用操作系统隐喻概括 LLM 应用栈",
    maturity: "概念框架",
    definition: "把大模型视为新型操作系统内核，连接记忆、工具、应用和用户界面。",
    relations: [
      { target: "ai-agent", type: "contains" },
      { target: "tool-use", type: "contains" },
      { target: "andrej-karpathy", type: "person" },
    ],
  },
  {
    id: "a2a-protocol",
    name: "Agent-to-Agent",
    category: "Agent协议与范式",
    heat: 76,
    first_appear: "2025-04",
    origin: "多智能体生态提出的代理间通信协议方向",
    maturity: "生态早期",
    definition: "让不同智能体之间发现能力、交换任务状态并协作完成目标的协议方向。",
    relations: [
      { target: "multi-agent-system", type: "optimizes" },
      { target: "mcp", type: "applies" },
    ],
  },
  {
    id: "sparse-autoencoder",
    name: "Sparse Autoencoder",
    category: "AI安全与对齐",
    heat: 76,
    first_appear: "2023-10",
    origin: "可解释性研究中用于拆解模型内部特征的工具",
    maturity: "研究前沿",
    definition: "用稀疏表示学习模型内部特征，帮助研究大模型为何这样回答。",
    relations: [
      { target: "interpretability", type: "applies" },
      { target: "ai-alignment", type: "optimizes" },
    ],
  },
];

const REFERENCE_CONCEPTS = [
  {
    id: "transformer",
    references: [
      { label: "Transformer paper", url: "https://arxiv.org/abs/1706.03762" },
      { label: "NeurIPS paper page", url: "https://proceedings.neurips.cc/paper/2017/hash/3f5ee243547dee91fbd053c1c4a845aa-Abstract.html" },
    ],
  },
  {
    id: "bert",
    references: [{ label: "BERT paper", url: "https://arxiv.org/abs/1810.04805" }],
  },
  {
    id: "gpt",
    references: [
      { label: "GPT paper", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
      { label: "GPT-2 paper", url: "https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf" },
    ],
  },
  {
    id: "rag",
    references: [{ label: "RAG paper", url: "https://arxiv.org/abs/2005.11401" }],
  },
  {
    id: "lora",
    references: [{ label: "LoRA paper", url: "https://arxiv.org/abs/2106.09685" }],
  },
  {
    id: "rlhf",
    references: [
      { label: "Human Preferences paper", url: "https://arxiv.org/abs/1706.03741" },
      { label: "InstructGPT paper", url: "https://arxiv.org/abs/2203.02155" },
    ],
  },
  {
    id: "dpo",
    references: [{ label: "DPO paper", url: "https://arxiv.org/abs/2305.18290" }],
  },
  {
    id: "react",
    references: [
      { label: "ReAct paper", url: "https://arxiv.org/abs/2210.03629" },
      { label: "ReAct project", url: "https://react-lm.github.io/" },
    ],
  },
  {
    id: "mcp",
    references: [
      { label: "MCP announcement", url: "https://www.anthropic.com/news/model-context-protocol" },
      { label: "MCP docs", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
    ],
  },
  {
    id: "flashattention",
    references: [
      { label: "FlashAttention paper", url: "https://arxiv.org/abs/2205.14135" },
      { label: "FlashAttention-2 paper", url: "https://arxiv.org/abs/2307.08691" },
    ],
  },
  {
    id: "mamba",
    references: [
      { label: "Mamba paper", url: "https://arxiv.org/abs/2312.00752" },
      { label: "Mamba GitHub", url: "https://github.com/state-spaces/mamba" },
    ],
  },
  {
    id: "chain-of-thought",
    references: [{ label: "Chain-of-Thought paper", url: "https://arxiv.org/abs/2201.11903" }],
  },
  {
    id: "skills",
    references: [
      { label: "Claude Skills docs", url: "https://docs.anthropic.com/en/docs/claude-code/skills" },
      { label: "Claude Code docs", url: "https://docs.anthropic.com/en/docs/claude-code/overview" },
    ],
  },
  {
    id: "ai-agent",
    aliases: ["Agent", "智能体", "AI智能体", "AI 代理"],
    relations: [
      { target: "workflow", type: "contains" },
      { target: "agentic-workflow", type: "contains" },
      { target: "agent-hook", type: "applies" },
      { target: "agent-tracing", type: "applies" },
    ],
  },
  {
    id: "tool-use",
    aliases: ["工具使用", "工具调用", "Tool Calling"],
    relations: [
      { target: "agent-hook", type: "applies" },
      { target: "agent-tracing", type: "applies" },
    ],
  },
  {
    id: "autonomous-workflow",
    aliases: ["自主工作流", "Autonomous Workflows", "自动化工作流"],
    relations: [
      { target: "workflow", type: "derives" },
      { target: "agentic-workflow", type: "derives" },
      { target: "durable-execution", type: "optimizes" },
    ],
    references: [{ label: "LangGraph Workflows", url: "https://docs.langchain.com/oss/python/langgraph/workflows-agents" }],
  },
  {
    id: "guardrails",
    aliases: ["安全护栏", "护栏", "Guardrail", "Safety Guardrails"],
    relations: [
      { target: "agent-hook", type: "applies" },
      { target: "human-in-the-loop", type: "contains" },
      { target: "agent-tracing", type: "applies" },
    ],
    references: [{ label: "OpenAI Agents Guardrails", url: "https://openai.github.io/openai-agents-python/guardrails/" }],
  },
  {
    id: "llama",
    references: [
      { label: "LLaMA paper", url: "https://arxiv.org/abs/2302.13971" },
      { label: "Llama official", url: "https://ai.meta.com/llama/" },
    ],
  },
  {
    id: "gemini",
    references: [{ label: "Gemini official", url: "https://deepmind.google/technologies/gemini/" }],
  },
  {
    id: "claude",
    references: [{ label: "Claude official", url: "https://www.anthropic.com/claude" }],
  },
  {
    id: "deepseek-r1",
    references: [
      { label: "DeepSeek-R1 release", url: "https://api-docs.deepseek.com/news/news250120" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" },
    ],
  },
];

const PEOPLE = [
  {
    id: "alan-turing",
    name: "Alan Turing",
    kind: "person",
    heat: 84,
    active_since: "1950",
    role: "现代计算与 AI 思想源头",
    contribution: "提出图灵测试，为“机器能否思考”的讨论奠定起点。",
    definition: "英国数学家与计算机科学先驱，AI 编年史通常从他的机器智能问题开始。",
    concepts: ["turing-test"],
    portraitPage: "Alan_Turing",
    references: [{ label: "Turing Test", url: "https://plato.stanford.edu/entries/turing-test/" }],
  },
  {
    id: "geoffrey-hinton",
    name: "Geoffrey Hinton",
    kind: "person",
    heat: 86,
    active_since: "1986",
    role: "深度学习奠基人之一",
    contribution: "推动反向传播、深度神经网络和表示学习复兴。",
    definition: "深度学习关键人物，长期推动神经网络从研究走向现代 AI 主流。",
    concepts: ["deep-learning"],
    portraitPage: "Geoffrey_Hinton",
    references: [
      { label: "Hinton homepage", url: "https://www.cs.toronto.edu/~hinton/" },
      { label: "Backpropagation paper", url: "https://www.nature.com/articles/323533a0" },
    ],
  },
  {
    id: "yoshua-bengio",
    name: "Yoshua Bengio",
    kind: "person",
    heat: 78,
    active_since: "1990",
    role: "深度学习奠基人之一",
    contribution: "推动表示学习、神经语言模型和深度学习教育体系。",
    definition: "深度学习三巨头之一，对现代神经网络和 AI 人才生态影响深远。",
    concepts: ["deep-learning"],
    portraitPage: "Yoshua_Bengio",
    references: [{ label: "Bengio homepage", url: "https://yoshuabengio.org/" }],
  },
  {
    id: "yann-lecun",
    name: "Yann LeCun",
    kind: "person",
    heat: 80,
    active_since: "1989",
    role: "卷积网络与自监督学习代表人物",
    contribution: "推动 CNN、视觉识别和自监督世界模型研究。",
    definition: "Meta AI 首席科学家，长期研究视觉、表征学习和机器智能。",
    concepts: ["computer-vision", "world-model"],
    portraitPage: "Yann_LeCun",
    references: [
      { label: "LeCun homepage", url: "https://yann.lecun.com/" },
      { label: "Meta AI profile", url: "https://ai.meta.com/people/yann-lecun/" },
    ],
  },
  {
    id: "fei-fei-li",
    name: "Fei-Fei Li",
    kind: "person",
    heat: 78,
    active_since: "2009",
    role: "ImageNet 与视觉 AI 关键人物",
    contribution: "ImageNet 推动了 2012 年深度学习视觉突破。",
    definition: "计算机视觉和以人为本 AI 代表人物，ImageNet 使大规模视觉数据成为深度学习引擎。",
    concepts: ["image-understanding"],
    portraitPage: "Fei-Fei_Li",
    references: [
      { label: "Stanford profile", url: "https://profiles.stanford.edu/fei-fei-li" },
      { label: "ImageNet paper", url: "https://ieeexplore.ieee.org/document/5206848" },
    ],
  },
  {
    id: "andrew-ng",
    name: "Andrew Ng",
    kind: "person",
    heat: 76,
    active_since: "2011",
    role: "AI 教育与产业化推动者",
    contribution: "推动在线机器学习教育、Google Brain 和应用型 AI 落地。",
    definition: "AI 教育和产业应用代表人物，帮助机器学习从学术圈进入更广泛的工程实践。",
    concepts: ["mlops", "ai-education"],
    portraitPage: "Andrew_Ng",
    references: [{ label: "Andrew Ng homepage", url: "https://www.andrewng.org/" }],
  },
  {
    id: "ashish-vaswani",
    name: "Ashish Vaswani",
    kind: "person",
    heat: 82,
    active_since: "2017",
    role: "Transformer 论文第一作者",
    contribution: "与 Noam Shazeer、Niki Parmar、Jakob Uszkoreit、Llion Jones、Aidan Gomez、Lukasz Kaiser、Illia Polosukhin 等共同提出 Transformer。",
    definition: "Transformer 关键作者之一，这一架构成为现代大模型的核心基础。",
    concepts: ["transformer"],
    portrait: "",
    portraitPage: "Ashish_Vaswani",
    references: [{ label: "Attention Is All You Need", url: "https://arxiv.org/abs/1706.03762" }],
  },
  {
    id: "shunyu-yao",
    name: "Shunyu Yao / 姚顺雨",
    nativeName: "姚顺雨",
    aliases: ["姚顺雨", "Yao Shunyu", "ReAct作者", "阿里巴巴的姚顺雨"],
    kind: "person",
    heat: 74,
    active_since: "2022",
    role: "ReAct 论文作者 / OpenAI 研究者",
    contribution: "提出 ReAct，把 reasoning 与 acting 结合为智能体经典范式；公开个人资料显示其曾在 Google Research 工作，当前为 OpenAI 研究者。",
    definition: "语言模型智能体研究者，ReAct 让工具调用和推理轨迹成为 Agent 设计核心。用户搜索“姚顺雨”也会定位到这里。",
    concepts: ["react"],
    companies: ["openai"],
    portrait: "https://ysymyth.github.io/images/self.jpeg",
    references: [
      { label: "ReAct paper", url: "https://arxiv.org/abs/2210.03629" },
      { label: "Profile", url: "https://ysymyth.github.io/" },
    ],
  },
  {
    id: "sam-altman",
    name: "Sam Altman",
    kind: "person",
    heat: 82,
    active_since: "2015",
    role: "OpenAI CEO",
    contribution: "推动 ChatGPT、GPT 系列模型和大模型平台化。",
    definition: "OpenAI 的核心商业与产品领导者之一。",
    concepts: ["gpt", "chatgpt"],
    portraitPage: "Sam_Altman",
    references: [{ label: "OpenAI leadership", url: "https://openai.com/about/" }],
  },
  {
    id: "dario-amodei",
    name: "Dario Amodei",
    kind: "person",
    heat: 78,
    active_since: "2021",
    role: "Anthropic CEO",
    contribution: "推动 Claude、Constitutional AI、MCP 等安全导向模型生态。",
    definition: "Anthropic 联合创始人，代表了大模型安全和对齐优先的产品路线。",
    concepts: ["constitutional-ai", "mcp"],
    portraitPage: "Dario_Amodei",
    references: [{ label: "Anthropic leadership", url: "https://www.anthropic.com/company" }],
  },
  {
    id: "demis-hassabis",
    name: "Demis Hassabis",
    kind: "person",
    heat: 80,
    active_since: "2010",
    role: "Google DeepMind CEO",
    contribution: "推动 AlphaGo、AlphaFold、Gemini 等系统。",
    definition: "将强化学习、科学 AI 和通用模型结合到产业级研究路线中的关键人物。",
    concepts: ["alphago", "alphafold", "gemini"],
    portraitPage: "Demis_Hassabis",
    references: [{ label: "DeepMind profile", url: "https://deepmind.google/about/" }],
  },
  {
    id: "ilya-sutskever",
    name: "Ilya Sutskever",
    kind: "person",
    heat: 80,
    active_since: "2012",
    role: "深度学习与 OpenAI 关键研究者",
    contribution: "参与 AlexNet、Seq2Seq、OpenAI 早期模型路线，并创立 SSI。",
    definition: "现代深度学习和大模型训练路线的重要研究者。",
    concepts: ["gpt", "deep-learning"],
    portraitPage: "Ilya_Sutskever",
    references: [
      { label: "AlexNet paper", url: "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" },
      { label: "SSI", url: "https://ssi.inc/" },
    ],
  },
  {
    id: "andrej-karpathy",
    name: "Andrej Karpathy",
    kind: "person",
    heat: 78,
    active_since: "2015",
    role: "AI 工程教育与 LLM OS 概念传播者",
    contribution: "把 LLM 应用栈形象化为操作系统，并推动 AI 工程教育普及。",
    definition: "AI 工程和教育领域的重要传播者，影响了开发者理解大模型应用的方式。",
    concepts: ["llm-os", "ai-coding"],
    portraitPage: "Andrej_Karpathy",
    references: [{ label: "Karpathy homepage", url: "https://karpathy.ai/" }],
  },
  {
    id: "liang-wenfeng",
    name: "Liang Wenfeng",
    kind: "person",
    heat: 74,
    active_since: "2023",
    role: "DeepSeek 创始人",
    contribution: "推动低成本高性能开源模型路线进入全球视野。",
    definition: "DeepSeek 代表人物，推动中国开源大模型在 2025 年引发全球关注。",
    concepts: ["deepseek-r1"],
    portraitPage: "Liang_Wenfeng",
    references: [{ label: "DeepSeek", url: "https://www.deepseek.com/" }],
  },
  {
    id: "elon-musk",
    name: "Elon Musk / 马斯克",
    nativeName: "马斯克",
    aliases: ["马斯克", "埃隆马斯克", "Elon", "xAI创始人", "Grok创始人"],
    kind: "person",
    heat: 88,
    active_since: "2023",
    role: "xAI 创始人",
    contribution: "创立 xAI 并推动 Grok 模型、X 平台实时数据整合和大规模 AI 算力基础设施。",
    definition: "xAI 创始人，也是把 AI、社交平台和超大算力集群绑定到一起的关键产业人物。",
    concepts: ["reasoning-model", "tool-use"],
    companies: ["xai"],
    portraitPage: "Elon_Musk",
    references: [
      { label: "xAI", url: "https://x.ai/" },
      { label: "xAI news", url: "https://x.ai/news" },
    ],
  },
  {
    id: "yan-junjie",
    name: "Yan Junjie / 闫俊杰",
    nativeName: "闫俊杰",
    aliases: ["闫俊杰", "Yan Junjie", "MiniMax CEO", "MiniMax总裁", "MiniMax的总裁", "MiniMax创始人"],
    kind: "person",
    heat: 76,
    active_since: "2021",
    role: "MiniMax 创始人兼 CEO",
    contribution: "推动 MiniMax 在多模态、语音、视频生成和 C 端 AI 应用上的模型与产品化路线。",
    definition: "MiniMax 的核心创业者和管理者之一，搜索“MiniMax 的总裁”会定位到这里。",
    concepts: ["video-generation", "text-to-speech", "ai-copilot"],
    companies: ["minimax"],
    references: [
      { label: "MiniMax", url: "https://www.minimax.io/" },
      { label: "Hailuo AI", url: "https://hailuoai.video/" },
    ],
  },
];

const COMPANIES = [
  {
    id: "openai",
    name: "OpenAI",
    kind: "company",
    heat: 98,
    founded: "2015-12",
    valuation: "约5000亿至8300亿美元级估值（非上市公司，2025/2026 公开报道口径）",
    valuation_basis: "公开报道/二级市场口径，非实时市值；后续融资会快速变化。",
    headquarters: "美国旧金山",
    employees: "约3000+人（公开报道估算）",
    definition: "生成式 AI 和大语言模型平台化的核心公司，推动 ChatGPT、GPT、Codex、Deep Research 等产品。",
    achievements: "ChatGPT 将大模型推向大众市场；推动函数调用、多模态、推理模型和 AI Agent 产品化。",
    models: [
      { name: "GPT-4", release: "2023-03", capability: "多任务语言理解与生成，成为企业级 LLM 代表。", url: "https://openai.com/index/gpt-4-research/" },
      { name: "GPT-4o", release: "2024-05", capability: "原生多模态，支持文本、图像、语音的实时交互。", url: "https://openai.com/index/hello-gpt-4o/" },
      { name: "o3", release: "2025-04", capability: "偏复杂推理、代码和数学任务的推理模型。", url: "https://openai.com/index/introducing-o3-and-o4-mini/" },
      { name: "GPT-5", release: "2025-08", capability: "统一多模态、长上下文与更强代理式任务能力。", url: "https://openai.com/index/introducing-gpt-5/" },
    ],
    concepts: ["gpt", "function-calling", "deep-research", "code-agent"],
    people: ["sam-altman", "ilya-sutskever"],
    references: [
      { label: "OpenAI", url: "https://openai.com/" },
      { label: "OpenAI news", url: "https://openai.com/news/" },
      { label: "GPT-4o release", url: "https://openai.com/index/hello-gpt-4o/" },
      { label: "GPT-5 release", url: "https://openai.com/index/introducing-gpt-5/" },
      { label: "估值报道 Reuters/Yahoo", url: "https://finance.yahoo.com/news/openai-hits-500-billion-valuation-050859895.html" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    kind: "company",
    heat: 94,
    founded: "2021-01",
    valuation: "公司披露1830亿美元；后续公开报道最高约3800亿美元级（非上市口径）",
    valuation_basis: "公开融资/媒体报道口径，非实时市值。",
    headquarters: "美国旧金山",
    employees: "约1500+人（公开报道估算）",
    definition: "以安全、对齐、长上下文和代码能力见长的大模型公司，代表产品为 Claude 与 Claude Code。",
    achievements: "提出 Constitutional AI，发布 MCP，把 Agent 工具连接协议推向主流开发者生态。",
    models: [
      { name: "Claude 3.5 Sonnet", release: "2024-06", capability: "代码、写作和视觉理解能力突出的主力模型。", url: "https://www.anthropic.com/news/claude-3-5-sonnet" },
      { name: "Claude Sonnet 4.5", release: "2025-09", capability: "面向长任务、代码代理和复杂工作流。", url: "https://www.anthropic.com/news/claude-sonnet-4-5" },
      { name: "Claude Code", release: "2025-02", capability: "代理式代码理解、修改、测试和自动化。", url: "https://docs.anthropic.com/en/docs/claude-code/overview" },
    ],
    concepts: ["constitutional-ai", "mcp", "skills", "claude-code"],
    people: ["dario-amodei"],
    references: [
      { label: "Anthropic", url: "https://www.anthropic.com/" },
      { label: "MCP", url: "https://www.anthropic.com/news/model-context-protocol" },
      { label: "Claude Sonnet 4.5", url: "https://www.anthropic.com/news/claude-sonnet-4-5" },
      { label: "Claude Skills", url: "https://docs.anthropic.com/en/docs/claude-code/skills" },
      { label: "Series F valuation", url: "https://www.anthropic.com/news/anthropic-raises-series-f-at-usd183b-post-money-valuation" },
      { label: "估值报道 Guardian", url: "https://www.theguardian.com/technology/2026/feb/12/anthropic-funding-round" },
    ],
  },
  {
    id: "google-deepmind",
    name: "Google DeepMind",
    kind: "company",
    heat: 93,
    founded: "2010-09",
    valuation: "Alphabet 旗下；市值以 GOOGL 实时行情为准",
    valuation_basis: "母公司上市公司实时市值口径，不等同于 Google DeepMind 独立估值。",
    headquarters: "英国伦敦 / 美国山景城",
    employees: "约数千人规模（Alphabet 内部团队）",
    definition: "科学 AI、强化学习和 Gemini 多模态模型的重要研发机构。",
    achievements: "AlphaGo、AlphaFold、AlphaTensor、Gemini 等系统连接了游戏、科学和通用智能研究。",
    models: [
      { name: "AlphaGo", release: "2016-03", capability: "强化学习和搜索结合，在围棋中击败顶尖人类棋手。", url: "https://deepmind.google/research/breakthroughs/alphago/" },
      { name: "AlphaFold", release: "2020-11", capability: "大幅提升蛋白质结构预测能力。", url: "https://deepmind.google/technologies/alphafold/" },
      { name: "Gemini 2.5 Pro", release: "2025-03", capability: "长上下文、多模态和复杂推理能力。", url: "https://deepmind.google/technologies/gemini/" },
    ],
    concepts: ["gemini", "world-model", "reasoning-model"],
    people: ["demis-hassabis"],
    references: [
      { label: "Google DeepMind", url: "https://deepmind.google/" },
      { label: "Gemini", url: "https://deepmind.google/technologies/gemini/" },
      { label: "Alphabet investor relations", url: "https://abc.xyz/investor/" },
    ],
  },
  {
    id: "meta-ai",
    name: "Meta AI",
    kind: "company",
    heat: 90,
    founded: "2013-09",
    valuation: "Meta Platforms 旗下；市值以 META 实时行情为准",
    valuation_basis: "母公司上市公司实时市值口径，不等同于 Meta AI 独立估值。",
    headquarters: "美国门洛帕克",
    employees: "Meta AI/FAIR 为 Meta 内部数千人级 AI 组织",
    definition: "开源大模型和 AI 基础研究的重要推动者，代表模型为 LLaMA/Llama 系列。",
    achievements: "用 LLaMA/Llama 系列推动开放权重生态；长期贡献 PyTorch、FAIR 研究和视觉/语言模型。",
    models: [
      { name: "LLaMA", release: "2023-02", capability: "开放权重模型生态的关键起点。", url: "https://arxiv.org/abs/2302.13971" },
      { name: "Llama 3", release: "2024-04", capability: "企业和开发者广泛使用的开放模型系列。", url: "https://ai.meta.com/blog/meta-llama-3/" },
      { name: "Llama 4", release: "2025-04", capability: "多模态和 MoE 路线的开放模型探索。", url: "https://ai.meta.com/blog/llama-4-multimodal-intelligence/" },
    ],
    concepts: ["llama", "toolformer", "pytorch"],
    people: ["yann-lecun"],
    references: [
      { label: "Meta AI", url: "https://ai.meta.com/" },
      { label: "Llama official", url: "https://ai.meta.com/llama/" },
      { label: "Meta investor relations", url: "https://investor.fb.com/" },
    ],
  },
  {
    id: "xai",
    name: "xAI",
    kind: "company",
    heat: 89,
    founded: "2023-07",
    valuation: "约2000亿至2500亿美元级口径（融资/并购报道口径，非实时市值）",
    valuation_basis: "公开融资/媒体报道口径，非实时市值；与 X/SpaceX 资本结构相关报道会变化。",
    headquarters: "美国旧金山湾区 / 德州与孟菲斯算力布局",
    employees: "约数百到千人级（公开报道估算）",
    definition: "Elon Musk 创立的大模型公司，代表产品为 Grok，强调实时信息、推理和社交平台整合。",
    achievements: "建设 Colossus 超算集群，把 Grok 深度接入 X 平台。",
    models: [
      { name: "Grok-1", release: "2023-11", capability: "接入 X 实时信息的对话模型。", url: "https://x.ai/news/grok" },
      { name: "Grok-3", release: "2025-02", capability: "强化推理、数学和代码表现。", url: "https://x.ai/news/grok-3" },
      { name: "Grok-4", release: "2025-07", capability: "更强推理和工具调用的旗舰模型。", url: "https://x.ai/news" },
    ],
    concepts: ["reasoning-model", "tool-use"],
    people: ["elon-musk"],
    references: [
      { label: "xAI", url: "https://x.ai/" },
      { label: "xAI news", url: "https://x.ai/news" },
      { label: "Series E funding", url: "https://x.ai/news/series-e" },
    ],
  },
  {
    id: "minimax",
    name: "MiniMax",
    kind: "company",
    heat: 86,
    founded: "2021-12",
    valuation: "IPO前约40亿美元；上市后市值曾升至300亿美元以上（公开报道/市场口径）",
    valuation_basis: "公开融资/上市相关报道口径，非实时市值。",
    headquarters: "中国上海",
    employees: "约数百到千人级（公开报道估算）",
    definition: "中国多模态与大模型公司，代表产品包括 MiniMax、海螺 AI/Hailuo、语音与视频生成模型。",
    achievements: "在长文本、语音、视频生成和 C 端应用上形成较高可见度。",
    models: [
      { name: "abab 系列", release: "2023-2024", capability: "文本、对话和工具应用基础模型。", url: "https://www.minimax.io/" },
      { name: "Hailuo Video", release: "2024-09", capability: "文本/图像到视频生成能力。", url: "https://hailuoai.video/" },
      { name: "MiniMax M1/M2", release: "2025", capability: "面向推理、编码和 Agent 的模型系列。", url: "https://www.minimax.io/" },
    ],
    concepts: ["video-generation", "text-to-speech", "ai-copilot"],
    people: ["yan-junjie"],
    references: [
      { label: "MiniMax", url: "https://www.minimax.io/" },
      { label: "Hailuo AI", url: "https://hailuoai.video/" },
      { label: "估值报道 Business Times", url: "https://www.businesstimes.com.sg/companies-markets/ai-model-developer-minimax-passes-hong-kong-stock-exchange-listing-hearing" },
    ],
  },
  {
    id: "moonshot-ai",
    name: "Moonshot AI / Kimi",
    kind: "company",
    heat: 88,
    founded: "2023-03",
    valuation: "约200亿美元级；后续融资目标可到300亿美元级（非上市公开报道口径）",
    valuation_basis: "公开融资报道口径，非实时市值。",
    headquarters: "中国北京",
    employees: "约数百人级（公开报道估算）",
    definition: "Kimi 背后的大模型公司，以长上下文、中文场景和开放模型路线受到关注。",
    achievements: "Kimi 长上下文产品进入大众视野，Kimi K2 推动开源 MoE 与 Agent 能力讨论。",
    models: [
      { name: "Kimi Chat", release: "2023-10", capability: "长文本阅读、总结和中文知识问答。", url: "https://www.kimi.com/" },
      { name: "Kimi K1.5", release: "2025-01", capability: "强化学习推理与多模态能力。", url: "https://moonshotai.github.io/Kimi-k1.5/" },
      { name: "Kimi K2", release: "2025-07", capability: "MoE、代码和 Agent 能力突出的开放模型。", url: "https://moonshotai.github.io/Kimi-K2/" },
    ],
    concepts: ["long-context", "mixture-of-experts", "agentic-rag"],
    references: [
      { label: "Kimi", url: "https://www.kimi.com/" },
      { label: "Kimi K2", url: "https://moonshotai.github.io/Kimi-K2/" },
      { label: "估值报道 SCMP", url: "https://www.scmp.com/tech/article/3352751/kimi-developer-moonshot-ai-valued-us20b-it-navigates-chinas-new-ipo-rules" },
    ],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    kind: "company",
    heat: 91,
    founded: "2023-05",
    valuation: "约500亿美元以上（非上市融资报道口径）",
    valuation_basis: "非上市公司，公开报道估值分歧较大；以公司披露与权威报道为准。",
    headquarters: "中国杭州",
    employees: "约数百人级（公开报道估算）",
    definition: "以高性价比训练、开源模型和推理模型 R1 引发全球关注的中国 AI 公司。",
    achievements: "DeepSeek-V3/R1 推动低成本高性能开源模型成为全球焦点。",
    models: [
      { name: "DeepSeek-V3", release: "2024-12", capability: "MoE 架构，强调训练效率和通用能力。", url: "https://api-docs.deepseek.com/news/news1226" },
      { name: "DeepSeek-R1", release: "2025-01", capability: "开源推理模型，推动 reasoning model 热潮。", url: "https://api-docs.deepseek.com/news/news250120" },
    ],
    concepts: ["reasoning-model", "mixture-of-experts", "test-time-compute"],
    people: ["liang-wenfeng"],
    references: [
      { label: "DeepSeek", url: "https://www.deepseek.com/" },
      { label: "DeepSeek-R1 release", url: "https://api-docs.deepseek.com/news/news250120" },
      { label: "DeepSeek-R1 paper", url: "https://arxiv.org/abs/2501.12948" },
      { label: "估值报道 Axios", url: "https://www.axios.com/2026/06/03/china-deepseek-billion" },
    ],
  },
  {
    id: "mistral-ai",
    name: "Mistral AI",
    kind: "company",
    heat: 84,
    founded: "2023-04",
    valuation: "约60亿至140亿美元级估值（非上市公开报道口径）",
    valuation_basis: "公开融资报道口径，非实时市值。",
    headquarters: "法国巴黎",
    employees: "约数百人级（公开报道估算）",
    definition: "欧洲代表性大模型公司，强调开放模型、企业部署和主权 AI。",
    achievements: "Mistral 7B、Mixtral、Mistral Large 等模型推动欧洲 LLM 生态。",
    models: [
      { name: "Mistral 7B", release: "2023-09", capability: "高效开放小模型代表。", url: "https://mistral.ai/news/announcing-mistral-7b" },
      { name: "Mixtral 8x7B", release: "2023-12", capability: "MoE 开放模型，兼顾效率和能力。", url: "https://mistral.ai/news/mixtral-of-experts" },
      { name: "Magistral", release: "2025-06", capability: "面向推理任务的模型系列。", url: "https://mistral.ai/news/magistral" },
    ],
    concepts: ["small-language-model", "mixture-of-experts"],
    references: [
      { label: "Mistral AI", url: "https://mistral.ai/" },
      { label: "Mistral models", url: "https://mistral.ai/products/la-plateforme" },
      { label: "估值报道 Yahoo/WSJ", url: "https://finance.yahoo.com/news/frances-mistral-ai-nears-deal-081046553.html" },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    kind: "company",
    heat: 82,
    founded: "2022-08",
    valuation: "约百亿至180亿美元级估值（非上市公开报道口径）",
    valuation_basis: "公开融资报道口径，非实时市值。",
    headquarters: "美国旧金山",
    employees: "约数百人级（公开报道估算）",
    definition: "AI 搜索和答案引擎代表公司，把检索、引用和生成式回答结合成新搜索体验。",
    achievements: "推动 AI Search、Research Agent 和带来源引用的答案引擎产品化。",
    models: [
      { name: "Sonar", release: "2025-01", capability: "面向联网搜索、引用和研究任务的模型/API。", url: "https://www.perplexity.ai/hub/blog/introducing-the-sonar-api" },
    ],
    concepts: ["ai-search", "rag", "deep-research"],
    references: [
      { label: "Perplexity", url: "https://www.perplexity.ai/" },
      { label: "Sonar API", url: "https://www.perplexity.ai/hub/blog/introducing-the-sonar-api" },
      { label: "估值报道 Yahoo", url: "https://finance.yahoo.com/news/perplexity-ai-achieves-18bn-valuation-113151944.html" },
    ],
  },
  {
    id: "cohere",
    name: "Cohere",
    kind: "company",
    heat: 78,
    founded: "2019-09",
    valuation: "约68亿美元级估值（非上市公司，公司披露/公开报道口径）",
    valuation_basis: "公开融资报道口径，非实时市值。",
    headquarters: "加拿大多伦多 / 美国旧金山",
    employees: "约数百人级（公开报道估算）",
    definition: "面向企业场景的大模型公司，强调检索、私有化和企业工作流。",
    achievements: "Command、Embed、Rerank 等模型服务进入企业 RAG 和搜索栈。",
    models: [
      { name: "Command R", release: "2024-03", capability: "面向 RAG、工具使用和企业问答。", url: "https://cohere.com/blog/command-r" },
      { name: "Command A", release: "2025-03", capability: "企业 Agent、工具调用和多语言能力。", url: "https://cohere.com/blog/command-a" },
    ],
    concepts: ["rag", "reranking", "embedding-model"],
    references: [
      { label: "Cohere", url: "https://cohere.com/" },
      { label: "Command R", url: "https://cohere.com/blog/command-r" },
      { label: "Command A", url: "https://cohere.com/blog/command-a" },
      { label: "Cohere funding", url: "https://cohere.com/blog/august-2025-funding-round" },
    ],
  },
];

const CHRONOLOGY = [
  { year: 1950, title: "Turing Test", summary: "Alan Turing 把机器智能问题推向现代讨论。", concepts: ["turing-test"] },
  { year: 1956, title: "Dartmouth Workshop", summary: "人工智能作为研究领域被正式命名。", concepts: ["artificial-intelligence"] },
  { year: 1986, title: "Backpropagation", summary: "反向传播重新点燃神经网络研究。", concepts: ["deep-learning"] },
  { year: 1997, title: "LSTM 与 Deep Blue", summary: "序列建模和符号搜索分别展示机器智能潜力。", concepts: ["lstm"] },
  { year: 2006, title: "Deep Learning", summary: "深度置信网络等工作推动深度学习复兴。", concepts: ["deep-learning"] },
  { year: 2012, title: "AlexNet", summary: "ImageNet 突破让深度学习成为视觉 AI 主流。", concepts: ["image-understanding"] },
  { year: 2014, title: "GAN", summary: "生成对抗网络打开生成式模型的重要分支。", concepts: ["gan"] },
  { year: 2017, title: "Transformer", summary: "Attention Is All You Need 提出 Transformer，现代大模型基础成型。", concepts: ["transformer"] },
  { year: 2018, title: "BERT 与 GPT", summary: "预训练语言模型进入快速扩张期。", concepts: ["bert", "gpt"] },
  { year: 2020, title: "RAG 与 GPT-3", summary: "大模型规模化和检索增强生成成为关键路线。", concepts: ["rag", "large-language-model"] },
  { year: 2021, title: "Foundation Model", summary: "基础模型概念被系统化，多模态和低成本微调开始加速。", concepts: ["foundation-model", "lora"] },
  { year: 2022, title: "ChatGPT 与 ReAct", summary: "聊天式 AI 爆发，同时 ReAct 把推理与行动结合成 Agent 范式。", concepts: ["react", "chatgpt"] },
  { year: 2023, title: "Agent Boom", summary: "LLaMA、AutoGPT、RAG 工程和多模态产品推动 AI 应用爆发。", concepts: ["llama", "autogpt", "ai-agent"] },
  { year: 2024, title: "MCP 与长上下文", summary: "模型连接工具和数据源成为 Agent 基础设施主题。", concepts: ["mcp", "long-context"] },
  { year: 2025, title: "Reasoning 与 Skills", summary: "推理模型、Claude Code、Skills、Deep Research 使 Agent 更接近可交付工作流。", concepts: ["skills", "deep-research", "reasoning-model"] },
  { year: 2026, title: "AI Concept Universe", summary: "AI 概念进入星系化理解：公司、人物、模型和协议共同演化。", concepts: ["context-engineering", "agentic-rag"] },
];

const ACHIEVEMENT_REFERENCES = {
  "Turing Test": [
    { label: "Stanford Encyclopedia", url: "https://plato.stanford.edu/entries/turing-test/" },
    { label: "Turing 1950 paper", url: "https://academic.oup.com/mind/article/LIX/236/433/986238" },
  ],
  "Dartmouth Workshop": [
    { label: "Dartmouth history", url: "https://home.dartmouth.edu/about/artificial-intelligence-ai-coined-dartmouth" },
  ],
  "Backpropagation": [
    { label: "Nature paper", url: "https://www.nature.com/articles/323533a0" },
  ],
  "LSTM 与 Deep Blue": [
    { label: "LSTM paper", url: "https://www.bioinf.jku.at/publications/older/2604.pdf" },
    { label: "IBM Deep Blue", url: "https://www.ibm.com/history/deep-blue" },
  ],
  "Deep Learning": [
    { label: "Deep learning 2006", url: "https://www.cs.toronto.edu/~hinton/absps/science.pdf" },
  ],
  AlexNet: [
    { label: "AlexNet paper", url: "https://proceedings.neurips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" },
  ],
  GAN: [
    { label: "GAN paper", url: "https://arxiv.org/abs/1406.2661" },
  ],
  Transformer: [
    { label: "Transformer paper", url: "https://arxiv.org/abs/1706.03762" },
  ],
  "BERT 与 GPT": [
    { label: "BERT paper", url: "https://arxiv.org/abs/1810.04805" },
    { label: "GPT paper", url: "https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf" },
  ],
  "RAG 与 GPT-3": [
    { label: "RAG paper", url: "https://arxiv.org/abs/2005.11401" },
    { label: "GPT-3 paper", url: "https://arxiv.org/abs/2005.14165" },
  ],
  "Foundation Model": [
    { label: "Foundation Models", url: "https://arxiv.org/abs/2108.07258" },
    { label: "LoRA paper", url: "https://arxiv.org/abs/2106.09685" },
  ],
  "ChatGPT 与 ReAct": [
    { label: "ChatGPT launch", url: "https://openai.com/index/chatgpt/" },
    { label: "ReAct paper", url: "https://arxiv.org/abs/2210.03629" },
  ],
  "Agent Boom": [
    { label: "LLaMA paper", url: "https://arxiv.org/abs/2302.13971" },
    { label: "AutoGPT", url: "https://github.com/Significant-Gravitas/AutoGPT" },
  ],
  "MCP 与长上下文": [
    { label: "MCP announcement", url: "https://www.anthropic.com/news/model-context-protocol" },
    { label: "MCP docs", url: "https://modelcontextprotocol.io/docs/getting-started/intro" },
  ],
  "Reasoning 与 Skills": [
    { label: "OpenAI o3/o4-mini", url: "https://openai.com/index/introducing-o3-and-o4-mini/" },
    { label: "Claude Skills docs", url: "https://docs.anthropic.com/en/docs/claude-code/skills" },
  ],
  "AI Concept Universe": [
    { label: "Stanford AI Index", url: "https://hai.stanford.edu/ai-index" },
  ],
};

function buildAchievements(chronology) {
  return chronology.map((event) => ({
    id: `achievement-${event.year}-${slugify(event.title)}`,
    name: `${event.year} · ${event.title}`,
    kind: "achievement",
    heat: event.year >= 2017 ? 92 : event.year >= 2012 ? 86 : 78,
    first_appear: String(event.year),
    year: event.year,
    category: "AI成就恒星",
    impact: event.summary,
    definition: event.summary,
    concepts: event.concepts || [],
    aliases: [event.title, `${event.year}`, `${event.year} ${event.title}`],
    relations: (event.concepts || []).map((target) => ({ target, type: "concept" })),
    references: ACHIEVEMENT_REFERENCES[event.title] || [],
  }));
}

const DAILY_SIGNALS = [
  {
    name: "Context Layer",
    category: "Agent协议与范式",
    heat: 82,
    definition: "位于模型和工具之间，负责组织任务上下文、权限、记忆和外部数据的系统层。",
    relations: [
      { target: "context-engineering", type: "derives" },
      { target: "mcp", type: "applies" },
    ],
  },
  {
    name: "Agent Sandbox",
    category: "AI安全与对齐",
    heat: 78,
    definition: "为智能体执行代码、浏览网页和调用工具提供隔离环境的安全机制。",
    relations: [
      { target: "secure-sandboxing", type: "derives" },
      { target: "computer-use-agent", type: "applies" },
    ],
  },
  {
    name: "Skill Marketplace",
    category: "Agent协议与范式",
    heat: 80,
    definition: "面向智能体能力包分发、发现和复用的生态形态。",
    relations: [
      { target: "skills", type: "derives" },
      { target: "mcp", type: "applies" },
    ],
  },
];

function ensureDirectories() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(VERSION_DIR, { recursive: true });
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function shanghaiDateId(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseArgs(argv) {
  const dateFlag = argv.find((arg) => arg.startsWith("--date="));
  return {
    seed: argv.includes("--seed"),
    dateId: dateFlag ? dateFlag.split("=")[1] : shanghaiDateId(),
  };
}

function stableHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < String(value).length; index += 1) {
    hash ^= String(value).charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function heatHistory(id, heat, dateId) {
  const hash = stableHash(`${id}:${dateId}`);
  return Array.from({ length: 30 }, (_, index) => {
    const wave = Math.sin((index + (hash % 17)) / 3.2) * 7;
    const jitter = ((stableHash(`${id}:${dateId}:${index}`) % 13) - 6) * 0.62;
    return Math.round(clamp(heat + wave + jitter));
  });
}

function makeReferences(name) {
  const query = encodeURIComponent(name);
  return [
    { label: "arXiv", url: `https://arxiv.org/search/?query=${query}&searchtype=all` },
    { label: "Semantic Scholar", url: `https://www.semanticscholar.org/search?q=${query}` },
  ];
}

function normalizeConcept(concept, dateId) {
  const id = concept.id || slugify(concept.name);
  return {
    ...concept,
    id,
    kind: "concept",
    heat: Math.round(clamp(Number(concept.heat || 50))),
    heat_history: Array.isArray(concept.heat_history) && concept.heat_history.length === 30 ? concept.heat_history : heatHistory(id, concept.heat || 50, dateId),
    relations: Array.isArray(concept.relations) ? concept.relations : [],
    references: concept.references || makeReferences(concept.name || id),
  };
}

function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function mergeById(base, additions) {
  const map = new Map(base.map((item) => [item.id, item]));
  for (const addition of additions) {
    const existing = map.get(addition.id);
    if (existing) {
      map.set(addition.id, {
        ...existing,
        ...addition,
        relations: mergeRelations(existing.relations || [], addition.relations || []),
        references: [...(existing.references || []), ...(addition.references || [])].filter(uniqueReference),
      });
    } else {
      map.set(addition.id, addition);
    }
  }
  return Array.from(map.values());
}

function mergeRelations(base, additions) {
  const key = (relation) => `${relation.target}:${relation.type}`;
  const map = new Map(base.map((relation) => [key(relation), relation]));
  additions.forEach((relation) => map.set(key(relation), relation));
  return Array.from(map.values());
}

function uniqueReference(reference, index, all) {
  return all.findIndex((item) => item.url === reference.url) === index;
}

function enrichPayload(payload, dateId, changedConcepts = []) {
  const originalConcepts = Array.isArray(payload?.concepts) ? payload.concepts : [];
  const concepts = mergeById(
    originalConcepts.map((concept) => normalizeConcept(concept, dateId)),
    [...EXTRA_CONCEPTS.map((concept) => normalizeConcept(concept, dateId)), ...REFERENCE_CONCEPTS]
  );
  const companies = mergeById(payload?.companies || [], COMPANIES);
  const people = mergeById(payload?.people || [], PEOPLE);
  const chronology = mergeChronology(payload?.chronology || [], CHRONOLOGY);
  const achievements = mergeById(payload?.achievements || [], buildAchievements(chronology));

  for (const concept of concepts) {
    concept.heat = Math.round(clamp(concept.heat + ((stableHash(`${concept.id}:${dateId}:drift`) % 5) - 2) * 0.35));
    concept.heat_history = [...(concept.heat_history || heatHistory(concept.id, concept.heat, dateId)).slice(-29), concept.heat];
  }

  return {
    meta: {
      project: "AI Concept Universe",
      currentVersion: dateId,
      generatedAt: new Date().toISOString(),
      updateCadence: "daily",
      sourceMode: "mock-adapter-ready",
      changedConcepts,
      nodeCount: concepts.length + companies.length + people.length + achievements.length,
      conceptCount: concepts.length,
      companyCount: companies.length,
      peopleCount: people.length,
      achievementCount: achievements.length,
      chronologyStart: Math.min(...chronology.map((event) => Number(event.year))),
      chronologyEnd: Math.max(CURRENT_YEAR, ...chronology.map((event) => Number(event.year))),
      dataSources: [
        { name: "ArXiv Daily AI Papers", mode: "mock-adapter" },
        { name: "Technology Media Signals", mode: "mock-adapter" },
        { name: "Company/Model profiles", mode: "curated-source-links" },
      ],
    },
    concepts,
    companies,
    people,
    achievements,
    chronology,
    snapshots: payload?.snapshots || {},
  };
}

function mergeChronology(base, additions) {
  const map = new Map(base.map((event) => [`${event.year}:${event.title}`, event]));
  additions.forEach((event) => map.set(`${event.year}:${event.title}`, event));
  return Array.from(map.values()).sort((a, b) => Number(a.year) - Number(b.year));
}

function applyDailySignals(payload, dateId) {
  const changedConcepts = [];
  const signal = DAILY_SIGNALS[stableHash(dateId) % DAILY_SIGNALS.length];
  const id = slugify(signal.name);
  if (payload.concepts.some((concept) => concept.id === id)) {
    const concept = payload.concepts.find((item) => item.id === id);
    concept.heat = Math.round(clamp(Math.max(concept.heat, signal.heat) + 1));
    concept.heat_history = heatHistory(concept.id, concept.heat, dateId);
    changedConcepts.push({ id, name: signal.name, action: "heat-updated" });
  } else {
    payload.concepts.push(
      normalizeConcept(
        {
          id,
          name: signal.name,
          category: signal.category,
          heat: signal.heat,
          first_appear: dateId.slice(0, 7),
          origin: "每日热点模拟数据源",
          maturity: "新兴热点",
          definition: signal.definition,
          relations: signal.relations,
        },
        dateId
      )
    );
    changedConcepts.push({ id, name: signal.name, action: "created" });
  }
  payload.meta.changedConcepts = changedConcepts;
  payload.meta.nodeCount = payload.concepts.length + payload.companies.length + payload.people.length + (payload.achievements || []).length;
  payload.meta.conceptCount = payload.concepts.length;
  return payload;
}

function snapshotFor(payload, dateId) {
  return {
    date: dateId,
    generatedAt: new Date().toISOString(),
    concepts: payload.concepts,
    companies: payload.companies,
    people: payload.people,
    achievements: payload.achievements,
    chronology: payload.chronology,
    stats: {
      nodeCount: payload.meta.nodeCount,
      conceptCount: payload.meta.conceptCount,
      companyCount: payload.meta.companyCount,
      peopleCount: payload.meta.peopleCount,
      achievementCount: payload.meta.achievementCount,
    },
  };
}

function publicPayload(payload) {
  const { snapshots, ...rest } = payload;
  return rest;
}

function refreshEmbeddedPayload(payload) {
  if (!fs.existsSync(INDEX_PATH)) return;
  const html = fs.readFileSync(INDEX_PATH, "utf8");
  const serialized = JSON.stringify(payload).replace(/</g, "\\u003c");
  const next = html.replace(
    /(<script id="embedded-concepts" type="application\/json">\s*)[\s\S]*?(\s*<\/script>)/,
    `$1\n      ${serialized}\n    $2`
  );
  fs.writeFileSync(INDEX_PATH, next);
}

async function main() {
  ensureDirectories();
  const options = parseArgs(process.argv.slice(2));
  const dateId = options.dateId;
  const current = readJson(CONCEPTS_PATH, { concepts: [], companies: [], people: [], chronology: [], snapshots: {} });
  let payload = enrichPayload(current, dateId, []);
  if (!options.seed) payload = applyDailySignals(payload, dateId);
  payload.snapshots = {
    ...(payload.snapshots || {}),
    [dateId]: snapshotFor(payload, dateId),
  };
  writeJson(path.join(VERSION_DIR, `${dateId}.json`), payload.snapshots[dateId]);
  const publicData = publicPayload(payload);
  writeJson(CONCEPTS_PATH, publicData);
  refreshEmbeddedPayload(publicData);
  console.log(`AI Concept Universe updated: ${dateId}`);
  console.log(`Nodes: ${payload.meta.nodeCount} (${payload.meta.conceptCount} concepts, ${payload.meta.companyCount} companies, ${payload.meta.peopleCount} people, ${payload.meta.achievementCount} achievements)`);
  console.log(`Chronology: ${payload.meta.chronologyStart}-${payload.meta.chronologyEnd}`);
  console.log(`Data: ${path.relative(ROOT, CONCEPTS_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

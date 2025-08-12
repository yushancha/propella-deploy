import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 中文提示词映射（保留向后兼容）
const STYLE_PROMPTS: Record<string, string> = {
  pixel: "像素风格",
  cyberpunk: "赛博朋克风格", 
  fantasy: "奇幻魔法风格",
  scifi: "科幻未来风格",
  cartoon: "卡通动画风格"
};

const LEVEL_PROMPTS: Record<string, string> = {
  normal: "普通",
  elite: "精英", 
  epic: "史诗",
};

// 英文提示词映射（优化出海市场的图像生成质量）
const STYLE_PROMPTS_EN: Record<string, string> = {
  pixel: "pixel art style, 8-bit graphics, retro game asset, crisp edges, limited color palette, nostalgic game aesthetic",
  cyberpunk: "cyberpunk style, neon lights, futuristic, high-tech, dystopian, holographic elements, metallic surfaces, digital glow", 
  fantasy: "fantasy medieval style, magical, detailed ornaments, mystical aura, intricate engravings, ancient craftsmanship, enchanted appearance",
  scifi: "sci-fi style, futuristic technology, sleek design, advanced materials, holographic interfaces, energy effects, space-age aesthetics",
  cartoon: "cartoon style, vibrant colors, animated look, clean outlines, exaggerated proportions, stylized design, playful appearance"
};

const LEVEL_PROMPTS_EN: Record<string, string> = {
  normal: "common quality, standard game item, basic craftsmanship, functional design",
  elite: "rare quality, enhanced details, glowing effects, premium materials, distinctive features", 
  epic: "epic legendary quality, intricate details, particle effects, masterwork craftsmanship, aura effects, unique design elements",
};

const MODEL = "doubao-seedream-3-0-t2i-250415";
const API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations";
const API_KEY = process.env.VOLCENGINE_API_KEY || "4452940e-651c-4dfc-814b-5d949c20a5e1";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
    }

    const body = await request.json();
    const { name, style, level } = body;

    if (!name || !style || !level) {
      return NextResponse.json({ success: false, error: "参数不完整" }, { status: 400 });
    }

    const stylePrompt = STYLE_PROMPTS[style];
    const levelPrompt = LEVEL_PROMPTS[level];
    
    if (!stylePrompt || !levelPrompt) {
      return NextResponse.json({ success: false, error: "风格或等级不支持" }, { status: 400 });
    }

    // 构建更丰富的英文提示词
    const stylePromptEn = STYLE_PROMPTS_EN[style];
    const levelPromptEn = LEVEL_PROMPTS_EN[level];
    
    // 构建优化的英文提示词
    const prompt = `A ${levelPromptEn} ${name} in ${stylePromptEn}. Professional game prop asset, isolated on transparent background, high-resolution texture, detailed 3D rendering, PBR materials, game-ready asset, professional game art, studio lighting, centered composition, perfect for RPG games, no text or UI elements.`;
    
    // 同时记录中英文提示词用于调试
    console.log("中文 prompt:", `${stylePrompt}，${levelPrompt}，${name}`);
    console.log("英文 prompt:", prompt);

    // 调用AI生成接口
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        prompt,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("火山方舟接口返回错误：", err);
      return NextResponse.json({ success: false, error: "AI生成服务暂时不可用" }, { status: 500 });
    }

    const data = await res.json();
    console.log("API 返回数据:", JSON.stringify(data, null, 2));
    
    // 提取图片URL
    let imageUrl;
    if (data.data && data.data[0] && data.data[0].url) {
      imageUrl = data.data[0].url;
    } else if (data.url) {
      imageUrl = data.url;
    } else if (data.image_url) {
      imageUrl = data.image_url;
    } else {
      console.error("无法从API响应中找到图片URL:", data);
      return NextResponse.json({ success: false, error: "AI返回格式错误，未找到图片URL" }, { status: 500 });
    }

    // 保存到历史记录
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });

      if (user) {
        await prisma.history.create({
          data: {
            name,
            style,
            level,
            url: imageUrl,
            userId: user.id
          }
        });
      }
    } catch (error) {
      console.error("保存历史记录失败:", error);
      // 不影响主流程，继续返回结果
    }

    // 返回成功结果
    return NextResponse.json({
      success: true,
      imageUrl,
      data: [{ url: imageUrl }]
    });

  } catch (error: any) {
    console.error("生成图片失败:", error);
    return NextResponse.json({ success: false, error: "生成失败: " + error.message }, { status: 500 });
  }
}

# 发给小龙虾 OpenClaw 的任务说明

请帮我修改一个本地 skill 里的封面生成脚本，只做最小修复，不要顺手重构。

目标文件：

`C:/Users/su_home/.codex/skills/wechat-article-publisher/scripts/generate_cover.py`

背景：

这个脚本原来调用阿里云 DashScope 生成微信公众号封面图，最近接口变更后，脚本会报 `400 Bad Request`，导致公众号草稿创建流程卡在封面生成这一步。

我已经确认过，旧脚本至少有两个问题：

1. 请求头里带了一个已经无效的头：
   `X-DashScope-Async: false`

2. 旧接口地址和响应结构都已经过期，继续用原来的写法会报错。

你要做的事：

1. 保留这个脚本原有的整体结构、参数、下载图片和压缩图片逻辑，不要改无关部分。
2. 只修复阿里云图片生成请求那一段。

具体要求：

1. 把阿里云接口地址从旧的：

`https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis`

改成新的：

`https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation`

2. 删除请求头里的：

`X-DashScope-Async: false`

保留正常的：

- `Authorization: Bearer ...`
- `Content-Type: application/json`

3. 把请求体从旧的这种结构：

```python
{
    "model": model,
    "input": {"prompt": prompt},
    "parameters": {
        "size": size,
        "n": 1,
    },
}
```

改成新的多模态结构：

```python
{
    "model": model,
    "input": {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    },
    "parameters": {
        "size": size,
        "n": 1,
    },
}
```

4. 响应解析也要一起改。

旧脚本大概率是从这里取图片地址：

```python
data["output"]["results"][0]["url"]
```

现在要改成从这里取：

```python
data["output"]["choices"][0]["message"]["content"][0]["image"]
```

如果 `choices` 为空，或者 `content` 为空，要抛出明确错误，不要静默失败。

5. 模型参数保持兼容。
如果你看到函数默认模型是 `qwen-image-2.0`，可以保留；如果实测只有 `qwen-image-2.0-pro` 更稳，也可以改默认值，但不要扩大修改范围。

验收要求：

请在修改后自己运行一遍，至少验证下面这个命令能成功：

```powershell
python C:\Users\su_home\.codex\skills\wechat-article-publisher\scripts\generate_cover.py --prompt "WeChat article cover for: test" --provider aliyun --output D:\tmp\cover.jpg
```

预期结果：

1. 命令返回成功
2. 输出 JSON 里包含 `image_url`
3. 本地成功生成图片文件

最后回复我时，请告诉我：

1. 你改了哪几处
2. 旧错误的根因是什么
3. 验证命令是否跑通

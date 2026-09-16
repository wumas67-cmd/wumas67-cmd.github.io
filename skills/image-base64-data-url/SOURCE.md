# Source and provenance

- Upstream skill: `darkamenosa/codex-imagen`
- Repository: https://github.com/darkamenosa/codex-imagen
- Downloaded commit: `0818536197599d8de6d96ac767babd9450565f66`
- Upstream license: MIT; the original `LICENSE` file is retained.
- Installed with the official Codex `skill-installer` helper on 2026-09-16.

The upstream skill was selected because it is an open-source Agent Skill with a standard `SKILL.md`, documents Windows-compatible local-image handling, and converts local reference images to `data:image/...;base64,...` URLs.

## Local adaptation

The upstream image-generation and OAuth workflow was broader than this project's need. This installed copy narrows the skill to offline local image encoding and adds dependency-free PowerShell and Python scripts. The Base64 data-URL pattern follows the upstream implementation and the OpenAI Agents Python local-image example:

- https://github.com/openai/openai-agents-python/blob/main/examples/basic/local_image.py

No image data is uploaded by either bundled script.

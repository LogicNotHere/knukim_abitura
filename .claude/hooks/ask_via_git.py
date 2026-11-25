#!/usr/bin/env python3
"""
PreToolUse-хук для AskUserQuestion.

Вместо того чтобы показывать вопрос исполнителю, хук:
  1. пишет вопрос в questions/Q-<время>.md, коммитит и пушит;
  2. каждые ASK_POLL_SECONDS делает git fetch и ждёт, пока владелец
     впишет ответ под строкой "## ОТВЕТ" и запушит;
  3. возвращает ответ агенту (как причину отказа инструмента).

Если запушить не получилось, вопрос показывается исполнителю как обычно.
Если ответа нет дольше ASK_WAIT_SECONDS, агент продолжает работу, которая
от ответа не зависит, и проверяет ответ позже.

Необязательно: задайте NTFY_TOPIC, чтобы получать пуш на телефон через ntfy.sh.
"""
import datetime
import json
import os
import re
import subprocess
import sys
import time
import urllib.request

WAIT = int(os.environ.get("ASK_WAIT_SECONDS", "3300"))
POLL = int(os.environ.get("ASK_POLL_SECONDS", "30"))
QDIR = "questions"
MARK = "## ОТВЕТ"


def git(*args):
    return subprocess.run(["git", *args], capture_output=True, text=True)


def reply(reason):
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }, ensure_ascii=False))
    sys.exit(0)


def fallback():
    # Ничего не выводим: Claude Code покажет вопрос как обычно.
    sys.exit(0)


def extract_answer(text):
    if MARK not in text:
        return ""
    ans = text.split(MARK, 1)[1]
    ans = re.sub(r"<!--.*?-->", "", ans, flags=re.S)
    return ans.strip()


def notify(title):
    topic = os.environ.get("NTFY_TOPIC")
    if not topic:
        return
    try:
        req = urllib.request.Request(
            f"https://ntfy.sh/{topic}", data=title.encode("utf-8"), method="POST")
        urllib.request.urlopen(req, timeout=10)
    except Exception:
        pass


def main():
    try:
        data = json.load(sys.stdin)
    except Exception:
        fallback()
    questions = (data.get("tool_input") or {}).get("questions") or []
    if not questions:
        fallback()

    root = git("rev-parse", "--show-toplevel").stdout.strip()
    if not root:
        fallback()
    os.chdir(root)

    qid = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    rel = f"{QDIR}/Q-{qid}.md"
    os.makedirs(QDIR, exist_ok=True)

    lines = [f"# Вопрос от агента · {qid}", ""]
    for i, q in enumerate(questions, 1):
        lines.append(f"### {i}. {q.get('question', '').strip()}")
        for j, o in enumerate(q.get("options") or [], 1):
            label, desc = o.get("label", ""), o.get("description", "")
            lines.append(f"{j}) **{label}** — {desc}" if desc else f"{j}) **{label}**")
        if q.get("multiSelect"):
            lines.append("_(можно выбрать несколько)_")
        lines.append("")
    lines += [
        MARK,
        "<!-- Напиши ответ ниже: номер варианта (например «1» или «1: 2, 2: свой текст») "
        "или просто текстом. Потом commit + push. -->",
        "",
    ]
    with open(rel, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    title = questions[0].get("question", "вопрос")[:70]
    git("add", rel)
    if git("commit", "-m", f"❓ {title}", "--", rel).returncode != 0:
        fallback()
    git("pull", "--rebase", "--autostash", "-q")
    if git("push", "-u", "origin", "HEAD").returncode != 0:
        fallback()
    notify(f"Агент спрашивает: {title}\n{rel}")

    deadline = time.time() + WAIT
    while time.time() < deadline:
        time.sleep(POLL)
        if git("fetch", "-q").returncode != 0:
            continue
        shown = git("show", f"@{{u}}:{rel}")
        if shown.returncode != 0:
            continue
        answer = extract_answer(shown.stdout)
        if answer:
            git("pull", "--rebase", "--autostash", "-q")
            asked = "\n".join(f"- {q.get('question', '')}" for q in questions)
            reply(
                "ОТВЕТ ВЛАДЕЛЬЦА через git (это не отказ, а настоящий ответ на твой вопрос).\n"
                f"Вопрос(ы):\n{asked}\n\nОтвет:\n{answer}\n\n"
                f"Файл: {rel}. Продолжай работу с учётом ответа."
            )

    reply(
        f"Владелец пока не ответил (вопрос лежит в {rel}). Не спрашивай исполнителя. "
        "Делай ту часть работы, которая от ответа не зависит. Перед тем как делать "
        f"зависимую часть, проверь ответ: `git fetch -q && git show @{{u}}:{rel}`. "
        "Если ответа так и не будет к концу работы, выбери рекомендованный вариант "
        "и явно отметь это в REPORT.md."
    )


if __name__ == "__main__":
    main()

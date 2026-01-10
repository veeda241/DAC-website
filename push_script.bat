@echo off
git add .
git commit -m "feat: Project updates and cleanups"
git push > push_log.txt 2>&1

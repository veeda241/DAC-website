@echo off
echo Starting... > debug_log.txt
python --version >> debug_log.txt 2>&1
echo Running assets... >> debug_log.txt
python scripts/run_tasks.py assets >> debug_log.txt 2>&1
echo Running PDF... >> debug_log.txt
python scripts/run_tasks.py pdf >> debug_log.txt 2>&1
echo Done. >> debug_log.txt

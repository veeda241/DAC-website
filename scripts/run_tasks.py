import sys
import os
# Add current directory to path to import local modules if run from scripts/
# Logic to import sibling modules
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

import asset_manager
import pdf_extractor

def main():
    if len(sys.argv) > 1:
        command = sys.argv[1]
        if command == "assets":
            asset_manager.run_asset_management()
        elif command == "pdf":
            pdf_extractor.process_reports()
        else:
            print("Unknown command. Usage: python scripts/run_tasks.py [assets|pdf]")
            print("Running all tasks by default...")
            asset_manager.run_asset_management()
            pdf_extractor.process_reports()
    else:
        print("Running all tasks...")
        asset_manager.run_asset_management()
        # pdf_extractor.process_reports() # Maybe don't run PDF extraction by default as it prints a lot
        print("\nTo run PDF extraction, use: python scripts/run_tasks.py pdf")

if __name__ == "__main__":
    main()

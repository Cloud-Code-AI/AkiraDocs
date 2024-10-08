from backend.app.analyze_repo import CodebaseAnalyzer
import json
import os
import asyncio
import time


def analyze_and_print(repo_path, github_token=None):
    analyzer = CodebaseAnalyzer(repo_path, github_token)
    api_spec = analyzer.analyze()  # Ensure this is awaited

    # print(f"API Specification for {repo_path}:")
    # print(json.dumps(api_spec, indent=2))

    output_file = f"examples/outputs/api_spec_{os.path.basename(repo_path)}.json"

    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)

    with open(output_file, "w") as f:
        json.dump(api_spec, f, indent=2)

    print(f"API specification has been saved to {output_file}")
    return api_spec


def main():
    start_time = time.time()
    # Example with a GitHub URL
    github_url = "https://github.com/yezz123/DogeAPI"
    analyze_and_print(github_url)

    # print("\n" + "="*50 + "\n")

    # Example with a local path
    # local_path = "sample_repos/flask_app"
    # analyze_and_print(local_path)
    print(f"Time taken: {time.time() - start_time} seconds")


if __name__ == "__main__":
    main()

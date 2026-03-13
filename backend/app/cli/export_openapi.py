import argparse
import json
from pathlib import Path

from app.main import create_app


def main() -> None:
    parser = argparse.ArgumentParser(description="Export FastAPI OpenAPI schema")
    parser.add_argument(
        "--output",
        default="openapi.json",
        help="Output path for generated OpenAPI JSON",
    )
    args = parser.parse_args()

    output_path = Path(args.output)
    app = create_app()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(app.openapi(), indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()

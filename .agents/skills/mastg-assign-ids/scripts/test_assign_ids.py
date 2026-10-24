import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("assign_ids.py").resolve()


class SharedDemoIdsTests(unittest.TestCase):
    def test_assigning_ids_preserves_shared_file_links(self):
        with tempfile.TemporaryDirectory() as directory:
            repo = Path(directory)
            env = dict(os.environ, GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM="1")

            def git(*args):
                return subprocess.check_output(
                    ["git", "-C", str(repo), *args],
                    env=env,
                    stderr=subprocess.STDOUT,
                    text=True,
                    timeout=20,
                )

            git("init", "--quiet")
            category = repo / "demos/android/MASVS-RESILIENCE"
            existing = category / "MASTG-DEMO-0001"
            existing.mkdir(parents=True)
            existing_source = existing / "MastgTest.kt"
            existing_content = 'val relatedDemo = "MASTG-DEMO-0x01"\n'
            existing_source.write_text(existing_content)
            git("add", ".")
            git(
                "-c", "user.name=Integration Check",
                "-c", "user.email=integration@example.invalid",
                "-c", "commit.gpgsign=false",
                "commit", "--quiet", "-m", "Baseline",
            )
            git("update-ref", "refs/remotes/origin/master", "HEAD")

            for demo_id in ("MASTG-DEMO-0x01", "MASTG-DEMO-0x02"):
                demo = category / demo_id
                demo.mkdir()
                (demo / f"{demo_id}.md").write_text(f"---\nid: {demo_id}\n---\n")
            source_content = 'fun mastgTest() = "sample"\n'
            (category / "MASTG-DEMO-0x01/MastgTest.kt").write_text(source_content)
            consumer = category / "MASTG-DEMO-0x02"
            (consumer / "MastgTest.kt").symlink_to("../MASTG-DEMO-0x01/MastgTest.kt")
            (consumer / "Shared.kt").symlink_to("../MASTG-DEMO-0001/MastgTest.kt")
            git("add", ".")

            subprocess.run(
                [
                    sys.executable, str(SCRIPT), "fix-ids",
                    "MASTG-DEMO-0x01=MASTG-DEMO-0998",
                    "MASTG-DEMO-0x02=MASTG-DEMO-0999",
                ],
                cwd=repo, env=env, check=True, capture_output=True, text=True, timeout=20,
            )

            consumer = category / "MASTG-DEMO-0999"
            with self.subTest("renamed shared source"):
                link = consumer / "MastgTest.kt"
                self.assertTrue(link.is_symlink())
                self.assertEqual(os.readlink(link), "../MASTG-DEMO-0998/MastgTest.kt")
                self.assertEqual(link.read_text(), source_content)
                self.assertEqual(
                    git("show", f":{link.relative_to(repo).as_posix()}"),
                    "../MASTG-DEMO-0998/MastgTest.kt",
                )
            with self.subTest("existing shared source is not modified through its link"):
                link = consumer / "Shared.kt"
                self.assertTrue(link.is_symlink())
                self.assertEqual(os.readlink(link), "../MASTG-DEMO-0001/MastgTest.kt")
                self.assertEqual(existing_source.read_text(), existing_content)
            with self.subTest("verification succeeds"):
                result = subprocess.run(
                    [sys.executable, str(SCRIPT), "verify"],
                    cwd=repo, env=env, capture_output=True, text=True, timeout=20,
                )
                self.assertEqual(result.returncode, 0, result.stdout + result.stderr)


if __name__ == "__main__":
    unittest.main()

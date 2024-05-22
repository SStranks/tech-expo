# tech-expo

<p align="left">
  <a href="https://github.com/SStranks/tech-expo/actions/workflows/lint.yaml">
		<img alt="Github Action Lint" src="https://github.com/SStranks/tech-expo/actions/workflows/lint.yaml/badge.svg">
	</a>
  <a href="https://github.com/SStranks/tech-expo/actions/workflows/test.yaml">
		<img alt="Github Action Test" src="https://github.com/SStranks/tech-expo/actions/workflows/test.yaml/badge.svg">
	</a>
  <a href="https://github.com/SStranks/tech-expo/actions/workflows/dependencies.yaml">
		<img alt="Github Action Test" src="https://github.com/SStranks/tech-expo/actions/workflows/dependencies.yaml/badge.svg">
	</a>
</p>

Fictional technology expo; mono-repo multi-app

# Cypress Testing

- WSL2 Ubuntu: ensure DISPLAY variable is set to ":0"; set manually or in .bashrc. Ignore Cypress Docs Advanced Installation; no need for XServer, only the Linux dependencies.
- Run Dev Server (webpack) then launch Cypress; start-server-and-test package handles this.

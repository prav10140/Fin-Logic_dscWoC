# Contributing to Fin-Logic

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to Fin-Logic. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Styleguide](#javascript-styleguide)

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Fin-Logic. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the steps to reproduce the problem** in as much detail as possible.
- **Provide specific examples** to demonstrate the steps.
- **Describe the behavior you observed** after following the steps and point out what essentially is the problem with that behavior.
- **Explain which behavior you expected to see instead** and why.
- **Include screenshots and animated GIFs** which show you following the defined steps.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Fin-Logic, including completely new features and minor improvements to existing functionality.

- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Provide specific examples** to demonstrate feature usage.
- **Explain why this enhancement would be useful** to most Fin-Logic users.

### Pull Requests

The process described here has several goals:

- Maintain Fin-Logic's quality.
- Fix problems that are important to users.
- Engage the community in working toward the best possible Fin-Logic.
- Enable a sustainable system for Fin-Logic's maintainers to review contributions.

Please follow these steps to have your contribution considered by the maintainers:

1.  **Fork** the repository to your own GitHub account.
2.  **Clone** the project to your machine.
3.  **Create a branch** locally with a succinct but descriptive name.
    ```bash
    git checkout -b my-new-feature
    ```
4.  **Commit** changes to the branch.
5.  **Push** changes to your fork.
6.  **Open a Pull Request** in our repository.

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.

### JavaScript Styleguide

- Use **ES6+** syntax.
- Use **const** and **let** over **var**.
- Prefer **arrow functions** over regular function expressions where appropriate.
- specific formatting rules (e.g. 2 spaces for indentation, semicolons, etc.) should follow the existing code style.

## Setting Up the Development Environment

1.  **Clone the repo**:
    ```bash
    git clone https://github.com/Th-Shivam/Fin-Logic.git
    cd Fin-Logic
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up Environment Variables**:
    Create a `.env` file and populate it with necessary keys (Groq API, Firebase Config). See `README.md` for details.
4.  **Run the server**:
    ```bash
    npm start
    ```

Thank you for contributing!

# Storybook

### What

Storybook is an open-source tool for developing UI components in isolation for frameworks like React, Vue, and Angular. It allows for building, testing, and showcasing components in an organized and efficient manner.

As we aim to build customized components, Storybook can assist us in creating, testing, and demonstrating these components before integrating them into projects.

### Where

- Configuration: The .storybook folder contains the main and preview configuration files.
- Stories: All component stories are stored in the src/stories folder.

### How

##### Running Storybook

To start the Storybook server, run the following command:

```sh
yarn run storybook
```

By default, this will start the Storybook server on port 6006. Open your browser and navigate to <http://localhost:6006> to access the Storybook UI.

##### Writing Stories

- Create a new file for your component stories in the src/stories folder, e.g., Button.stories.tsx.
- Add Story Content, [example for Button componnets](../src/stories/Button.stories.tsx)
- Explanation
  - Title: This title will appear in the Storybook UI for organization.
  - Component: The component for which the story is being written.
  - ArgTypes: Allows for actions and controls in the Storybook UI.

# React Click Away Listener

[![npm version](https://badge.fury.io/js/click-away-listener.svg)](https://badge.fury.io/js/click-away-listener)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React component and hook for detecting clicks outside an element, compatible with React 18 and Next.js.

## Thanks to

BatchNepal Consultancy : <https://batchnepal.com>

Support: <support@batchnepal.com>

## Features

- 🏗️ Both component and hook versions
- 🌐 Works with React 18 and Next.js
- 📱 Supports mouse and touch events
- 🛡️ TypeScript support
- 🎯 Exclude specific elements from triggering
- ⏯️ Disable functionality when needed

## Installation

```bash
npm install click-away-listener
# or
yarn add click-away-listener
```

## Usage

Components version:

```jsx
"use client"; // in next.js
import React from 'react';
import { ClickAwayListener } from 'click-away-listener';

function Dropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Dropdown</button>
      
      {open && (
        <ClickAwayListener onClickAway={() => setOpen(false)}>
          <div className="dropdown">
            Dropdown Content
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
}
```

<strong>Hooks Version:</strong>

```jsx
"use client"; // in next.js
import React from 'react';
import { useClickAway } from 'click-away-listener';

function Modal({ onClose }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickAway(modalRef, onClose);

  return (
    <div ref={modalRef} className="modal">
      Modal Content
    </div>
  );
}
```

## Bugs or Feature Requests

Please open pull request/issues at github or support ticket at <support@batchnepal.com>

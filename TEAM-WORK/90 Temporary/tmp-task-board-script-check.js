
    const columns = [
      ["todo", "To Do"],
      ["claimed", "Claimed / In Progress"],
      ["review", "Review"],
      ["reviewing", "Reviewing"],
      ["done", "Done"]
    ];

    const fallbackBoard = {
      boardName: "Artly Agent Task Board",
      updatedAt: "",
      columns: {
        todo: [],
        claimed: [],
        review: [],
        reviewing: [],
        done: [],
        archived: []
      }
    };

    const boardEl = document.getElementById("board");
    const archiveEl = document.getElementById("archiveBoard");
    const statusEl = document.getElementById("status");
    const boardNameEl = document.getElementById("boardName");
    const updatedAtEl = document.getElementById("updatedAt");
    const sourceNameEl = document.getElementById("sourceName");
    const reloadButton = document.getElementById("reloadButton");
    const fileInput = document.getElementById("fileInput");
    const collapsedTasks = new Set();
    let archiveTrayOpen = false;
    let currentBoard = fallbackBoard;
    let currentSourceLabel = "fallback";

    function escapeText(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    function listItems(items, formatter = escapeText) {
      if (!Array.isArray(items) || items.length === 0) return "";
      return `<ul>${items.map((item) => `<li>${formatter(item)}</li>`).join("")}</ul>`;
    }

    function renderFiles(files) {
      return listItems(files, (file) => `<code>${escapeText(file)}</code>`);
    }

    function field(label, content) {
      if (!content) return "";
      return `<div class="field"><strong>${escapeText(label)}</strong>${content}</div>`;
    }

    function taskKey(task) {
      return String(task.id || `${task.project || "task"}-${task.title || "untitled"}-${task.createdAt || ""}`);
    }

    function timestampValue(task) {
      const fields = ["archivedAt", "doneAt", "reviewedAt", "reviewRequestedAt", "claimedAt", "createdAt"];
      for (const fieldName of fields) {
        const value = Date.parse(task[fieldName] || "");
        if (!Number.isNaN(value)) return value;
      }
      return 0;
    }

    function columnTasks(tasks, columnKey) {
      const safeTasks = Array.isArray(tasks) ? [...tasks] : [];
      if (columnKey !== "done" && columnKey !== "archived") return safeTasks;
      return safeTasks.sort((a, b) => timestampValue(b) - timestampValue(a));
    }

    function taskRedoCount(task) {
      const parsed = Number.parseInt(task?.redoCount, 10);
      if (Number.isNaN(parsed) || parsed <= 0) return 0;
      return parsed;
    }

    function ticketCard(task, columnKey) {
      const priority = escapeText(task.priority || "normal");
      const key = taskKey(task);
      const isCollapsed = collapsedTasks.has(key);
      const toggleLabel = isCollapsed ? "Expand task" : "Collapse task";
      const redoCount = taskRedoCount(task);
      const chips = [
        task.project,
        task.type,
        task.claimedBy ? `Claimed: ${task.claimedBy}` : "",
        task.requestedBy ? `Requested: ${task.requestedBy}` : ""
      ].filter(Boolean);
      const redoBadge = redoCount > 0 ? `<span class="redo-badge">Redo x${redoCount}</span>` : "";
      const archiveButton = columnKey === "done"
        ? `<button class="text-button archive-task" type="button" data-archive-task="${escapeText(key)}">Archive</button>`
        : "";

      return `
        <article class="ticket ${isCollapsed ? "is-collapsed" : ""}" data-task-id="${escapeText(key)}">
          <div class="ticket-title-row">
            <div class="ticket-main">
              <h2>${escapeText(task.title || "Untitled task")}</h2>
              <div class="ticket-meta">${redoBadge}</div>
            </div>
            <div class="ticket-title-actions">
              ${archiveButton}
              <button class="icon-button ticket-toggle" type="button" data-task-toggle="${escapeText(key)}" aria-label="${toggleLabel}" title="${toggleLabel}">${isCollapsed ? "+" : "-"}</button>
            </div>
          </div>
          <div class="ticket-details" ${isCollapsed ? "hidden" : ""}>
            <div class="ticket-head">
              <div class="ticket-id">${escapeText(task.id || "No ID")}</div>
              <div class="priority ${priority.toLowerCase()}">${priority}</div>
            </div>
            ${task.summary ? `<p class="summary">${escapeText(task.summary)}</p>` : ""}
            ${chips.length ? `<div class="chips">${chips.map((chip) => `<span class="chip">${escapeText(chip)}</span>`).join("")}</div>` : ""}
            ${field("Requirements", listItems(task.requirements))}
            ${field("Acceptance", listItems(task.acceptanceCriteria))}
            ${field("Files", renderFiles(task.files))}
            ${field("Blockers", listItems(task.blockers))}
            ${task.notes ? field("Notes", `<p class="summary">${escapeText(task.notes)}</p>`) : ""}
          </div>
        </article>
      `;
    }

    function archiveCloseButton() {
      return `<button class="icon-button archive-close" type="button" data-archive-close aria-label="Close archived panel" title="Close archived panel">&times;</button>`;
    }

    function normalizeBoard(board) {
      const normalized = { ...fallbackBoard, ...board };
      normalized.columns = { ...fallbackBoard.columns, ...(board.columns || {}) };
      return normalized;
    }

    async function loadJson(url) {
      if (typeof window.fetch === "function") {
        const response = await window.fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      }

      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.overrideMimeType("application/json");
        request.onload = () => {
          if (request.status >= 200 && request.status < 300) {
            try {
              resolve(JSON.parse(request.responseText));
            } catch (error) {
              reject(error);
            }
            return;
          }
          reject(new Error(`HTTP ${request.status}`));
        };
        request.onerror = () => reject(new Error("Could not load JSON"));
        request.send();
      });
    }

    function postJson(url, payload) {
      if (typeof window.fetch === "function") {
        return window.fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }).then(async (response) => {
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
          return data;
        });
      }

      return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open("POST", url, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onload = () => {
          let data = {};
          try {
            data = JSON.parse(request.responseText || "{}");
          } catch (error) {
            reject(error);
            return;
          }
          if (request.status >= 200 && request.status < 300) {
            resolve(data);
            return;
          }
          reject(new Error(data.error || `HTTP ${request.status}`));
        };
        request.onerror = () => reject(new Error("Could not persist archive action"));
        request.send(JSON.stringify(payload));
      });
    }

    async function archiveTask(taskId) {
      statusEl.textContent = `Archiving ${taskId}...`;
      try {
        const board = await postJson("/api/archive", {
          taskId,
          archivedBy: "Task board viewer"
        });
        collapsedTasks.delete(taskId);
        renderBoard(board, "task-board.json");
        statusEl.textContent = `Archived ${taskId} and updated task-board.json.`;
      } catch (error) {
        statusEl.textContent = `Archive failed for ${taskId}: ${error.message}`;
      }
    }

    function laneMarkup(key, label, tasks, options = {}) {
      const allCollapsed = tasks.length > 0 && tasks.every((task) => collapsedTasks.has(taskKey(task)));
      const laneToggleLabel = allCollapsed ? `Expand all ${label} tasks` : `Collapse all ${label} tasks`;
      const extraActions = options.extraActions || "";
      const body = tasks.length
        ? tasks.map((task) => ticketCard(task, key)).join("")
        : `<div class="empty">No ${escapeText(label.toLowerCase())} tasks</div>`;
      const addlClass = options.extraClass ? ` ${options.extraClass}` : "";

      return `
        <section class="lane ${key}${addlClass}" aria-label="${escapeText(label)}">
          <div class="lane-header">
            <div class="lane-title"><span class="dot"></span><span>${escapeText(label)}</span></div>
            <div class="lane-actions">
              <span class="count">${tasks.length}</span>
              <button class="icon-button lane-toggle" type="button" data-lane-toggle="${escapeText(key)}" aria-label="${laneToggleLabel}" title="${laneToggleLabel}" ${tasks.length ? "" : "disabled"}>${allCollapsed ? "+" : "-"}</button>
              ${extraActions}
            </div>
          </div>
          <div class="lane-body">${body}</div>
        </section>
      `;
    }

    function renderBoard(board, sourceLabel) {
      const normalized = normalizeBoard(board);
      currentBoard = normalized;
      currentSourceLabel = sourceLabel;
      boardNameEl.textContent = normalized.boardName || "Artly Agent Task Board";
      updatedAtEl.textContent = `Updated: ${normalized.updatedAt || "unknown"}`;
      sourceNameEl.textContent = `Source: ${sourceLabel}`;

      boardEl.innerHTML = columns.map(([key, label]) => {
        const tasks = columnTasks(normalized.columns[key], key);
        return laneMarkup(key, label, tasks);
      }).join("");

      const archivedTasks = columnTasks(normalized.columns.archived, "archived");
      archiveEl.classList.toggle("is-open", archiveTrayOpen);
      archiveEl.innerHTML = `
        <button class="archive-tab" type="button" data-archive-toggle aria-expanded="${archiveTrayOpen ? "true" : "false"}" aria-controls="archived-panel">
          <span class="dot" aria-hidden="true"></span>
          <span>Archived (${archivedTasks.length})</span>
        </button>
        <div class="archive-tray" id="archived-panel" aria-hidden="${archiveTrayOpen ? "false" : "true"}">
          ${laneMarkup("archived", "Archived", archivedTasks, {
            extraClass: "archived-tray-lane",
            extraActions: archiveCloseButton()
          })}
        </div>
      `;
    }

    function toggleArchiveTray(forceOpen) {
      if (typeof forceOpen === "boolean") {
        archiveTrayOpen = forceOpen;
      } else {
        archiveTrayOpen = !archiveTrayOpen;
      }
      renderBoard(currentBoard, currentSourceLabel);
    }

    boardEl.addEventListener("click", (event) => {
      const archiveButton = event.target.closest("[data-archive-task]");
      if (archiveButton) {
        archiveTask(archiveButton.dataset.archiveTask);
        return;
      }

      const taskButton = event.target.closest("[data-task-toggle]");
      if (taskButton) {
        const key = taskButton.dataset.taskToggle;
        if (collapsedTasks.has(key)) {
          collapsedTasks.delete(key);
        } else {
          collapsedTasks.add(key);
        }
        renderBoard(currentBoard, currentSourceLabel);
        return;
      }

      const laneButton = event.target.closest("[data-lane-toggle]");
      if (!laneButton) return;

      const columnKey = laneButton.dataset.laneToggle;
      const tasks = columnTasks(currentBoard.columns[columnKey], columnKey);
      const keys = tasks.map(taskKey);
      const allCollapsed = keys.length > 0 && keys.every((key) => collapsedTasks.has(key));

      keys.forEach((key) => {
        if (allCollapsed) {
          collapsedTasks.delete(key);
        } else {
          collapsedTasks.add(key);
        }
      });

      renderBoard(currentBoard, currentSourceLabel);
    });

    archiveEl.addEventListener("click", (event) => {
      const archiveToggleButton = event.target.closest("[data-archive-toggle]");
      if (archiveToggleButton) {
        toggleArchiveTray();
        return;
      }

      const archiveCloseButton = event.target.closest("[data-archive-close]");
      if (archiveCloseButton) {
        toggleArchiveTray(false);
        return;
      }

      const taskButton = event.target.closest("[data-task-toggle]");
      if (taskButton) {
        const key = taskButton.dataset.taskToggle;
        if (collapsedTasks.has(key)) {
          collapsedTasks.delete(key);
        } else {
          collapsedTasks.add(key);
        }
        renderBoard(currentBoard, currentSourceLabel);
        return;
      }

      const laneButton = event.target.closest("[data-lane-toggle]");
      if (!laneButton) return;

      const columnKey = laneButton.dataset.laneToggle;
      const tasks = columnTasks(currentBoard.columns[columnKey], columnKey);
      const keys = tasks.map(taskKey);
      const allCollapsed = keys.length > 0 && keys.every((key) => collapsedTasks.has(key));

      keys.forEach((key) => {
        if (allCollapsed) {
          collapsedTasks.delete(key);
        } else {
          collapsedTasks.add(key);
        }
      });

      renderBoard(currentBoard, currentSourceLabel);
    });

    async function loadDefaultBoard() {
      statusEl.textContent = "Loading task-board.json...";
      try {
        const board = await loadJson("task-board.json");
        renderBoard(board, "task-board.json");
        statusEl.textContent = "Loaded task-board.json.";
      } catch (error) {
        renderBoard(fallbackBoard, "fallback");
        statusEl.textContent = "Could not auto-load task-board.json. Use Load JSON file if the browser blocks local file access.";
      }
    }

    fileInput.addEventListener("change", async (event) => {
      const [file] = event.target.files;
      if (!file) return;

      try {
        const text = await file.text();
        const board = JSON.parse(text);
        renderBoard(board, file.name);
        statusEl.textContent = `Loaded ${file.name}.`;
      } catch (error) {
        statusEl.textContent = `Could not load ${file.name}: ${error.message}`;
      }
    });

    reloadButton.addEventListener("click", loadDefaultBoard);
    loadDefaultBoard();
  
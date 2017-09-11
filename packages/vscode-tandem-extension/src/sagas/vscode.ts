import * as vscode from "vscode";
import * as fs from "fs";
import { editString, StringMutation } from "aerial-common2";
import { eventChannel } from "redux-saga";
import { select, take, put, fork, call } from "redux-saga/effects";
import { Alert, ALERT, AlertLevel, MUTATE_SOURCE_CONTENT, FILE_CONTENT_CHANGED, MutateSourceContentRequest, fileContentChanged, FileContentChanged, startDevServerExecuted, START_DEV_SERVER_EXECUTED, CHILD_DEV_SERVER_STARTED } from "../actions";
import { ExtensionState, getFileCacheContent } from "../state";
import { getEntryHTML } from "aerial-playground";

export function* vscodeSaga() {
  yield fork(handleAlerts);
  yield fork(handleMutateSourceContent);
  yield fork(handleFileContentChanged);
  yield fork(handleCommands);
  yield fork(handleStarted);
}

function* handleAlerts() {
  while(true) {
    const { level, text }: Alert = yield take(ALERT);
    switch(level) {
      case AlertLevel.ERROR: {
        vscode.window.showErrorMessage(text);
        break;
      }
      case AlertLevel.NOTICE: {
        vscode.window.showInformationMessage(text);
        break;
      }
      case AlertLevel.WARNING: {
        vscode.window.showWarningMessage(text);
        break;
      }
    }
  }
}

function* handleMutateSourceContent() {

  // TODO -- this code is copy pasted from dev tools server. Need
  // to use from common config.
  while(true) {
    const { filePath, mutations }: MutateSourceContentRequest = yield take(MUTATE_SOURCE_CONTENT);

    const state: ExtensionState = yield select();

    const editSourceContent = state.visualDevConfig.editSourceContent;

    let content = getFileCacheContent(filePath, state) || fs.readFileSync(filePath, "utf8");
    
    let stringMutations: StringMutation[] = [];
    
    for (const mutation of mutations) {
      if (!editSourceContent) {
        console.warn(`Cannot apply "${mutation.$type}" since "editSourceContent" does not exist in config`);
        continue;
      }

      const result = editSourceContent(content, mutation, filePath);
      stringMutations.push(...(Array.isArray(result) ? result : [result]));
    }  

    content = editString(content, stringMutations);

    yield put(fileContentChanged(filePath, content));
  }
}

function* handleFileContentChanged() {
  while(true) {
    const { filePath, content }: FileContentChanged = yield take(FILE_CONTENT_CHANGED);

    const activeTextEditor = vscode.window.activeTextEditor;

    vscode.workspace.openTextDocument(filePath).then(async (doc) => {
      await vscode.window.showTextDocument(doc);
      await vscode.window.activeTextEditor.edit((edit) => {
        edit.replace(
          new vscode.Range(
            doc.positionAt(0),
            doc.positionAt(doc.getText().length)
          ),
          content
        )
      });
    });
  }
}

function* handleCommands() {
  const chan = eventChannel((emit) => {
    vscode.commands.registerCommand("extension.startVisualDevServer", () => {
      emit(startDevServerExecuted());
    });
    return () => {};
  });

  while(true) {
    yield put(yield take(chan));
  }
}

const AERIAL_PREVIEW_NAME = `aerial-preview`;

const PREVIEW_URI = vscode.Uri.parse(`${AERIAL_PREVIEW_NAME}://authority/${AERIAL_PREVIEW_NAME}`);

function* handleStarted() {

  const state: ExtensionState = yield select();

  var textDocumentContentProvider = {
    provideTextDocumentContent(uri/*: vscode.Uri*/)/*: string*/ {
      return getEntryHTML({});
    },
  };

  
  state.context.subscriptions.push(
    vscode.workspace.registerTextDocumentContentProvider(
      AERIAL_PREVIEW_NAME,
      textDocumentContentProvider)
  );
  while(true) {
    yield take(CHILD_DEV_SERVER_STARTED);

    yield call(vscode.commands.executeCommand,
      "vscode.previewHtml",
      PREVIEW_URI,
      vscode.ViewColumn.Two,
      "Aerial view"
    );
  }
}
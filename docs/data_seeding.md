# ローカルデータのバックアップ / 共有

Whisky Tasting Note はブラウザの IndexedDB にノートを保存します。端末間で共有したい場合やバックアップを取りたい場合は、以下の手順で JSON をエクスポート／インポートしてください。アプリ内の「データ入出力ツール」（`/tools/data`）を利用すると、ブラウザだけで完結できます。

## 1. データのエクスポート

1. アプリの `/tools/data` ページで「JSON をダウンロード」を押す。もしくはアプリを開いた状態でブラウザの開発者ツールを開きます。
2. `Application` (または `Storage`) タブから `IndexedDB` → `whisky-notes` → `notes` を選択します。
3. 利用中のブラウザがエクスポート機能を提供している場合は、そのまま JSON として保存できます。無い場合は、以下のスニペットをコンソールで実行しダウンロードしてください。

```js
(async () => {
  const request = indexedDB.open("whisky-notes", 1);
  const db = await new Promise<IDBDatabase>((resolve, reject) => {
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
  const tx = db.transaction("notes", "readonly");
  const store = tx.objectStore("notes");
  const notes = await new Promise<any[]>((resolve, reject) => {
    const getAll = store.getAll();
    getAll.onerror = () => reject(getAll.error);
    getAll.onsuccess = () => resolve(getAll.result || []);
  });
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "whisky-notes-backup.json";
  a.click();
  URL.revokeObjectURL(url);
})();
```

## 2. データのインポート

1. `/tools/data` ページでインポートモード（追記 or 置き換え）を選び、JSON ファイルを指定します。
2. ブラウザ開発者ツールから復元する場合は、`IndexedDB` → `whisky-notes` → `notes` を開きます。
3. `Import` が利用できるブラウザでは、保存した JSON を指定して読み込みます。機能がない場合は、コンソールで JSON を読み込み `store.add`/`store.put` する簡単なスクリプトを実行してください（重複に注意）。
4. 読み込み後にページをリロードすると一覧に反映されます。

### 全データを削除したい場合

`/tools/data` ページの「すべて削除」ボタンを使用すると IndexedDB に保存されているノートを一括削除できます。復元できないため、必ず事前にエクスポートしてから実行してください。

## 3. 注意事項

- ブラウザのストレージは OS のクリーンアップやユーザー操作で削除される場合があります。重要なノートは定期的にエクスポートしてください。
- JSON にはテイスティング内容がそのまま含まれるため、取り扱いには注意しましょう。
- 将来的にクラウド同期機能を追加する場合は、この JSON をアップロードする API を追加するだけで移行可能です。

IndexedDB のスキーマは `apps/web/lib/localNotes.ts` を参照してください。

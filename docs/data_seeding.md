# ローカルデータのバックアップ / 共有

Whisky Tasting Note はブラウザの IndexedDB にノートを保存します。端末間で共有したい場合やバックアップを取りたい場合は、以下の手順で JSON をエクスポート／インポートしてください。

## 1. データのエクスポート

1. アプリを開いた状態でブラウザの開発者ツールを開きます。
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

1. バックアップを復元したい端末でアプリを開き、開発者ツールの `IndexedDB` → `whisky-notes` → `notes` を選択します。
2. `Import` が利用できるブラウザでは、保存した JSON を指定して読み込みます。
3. 機能がない場合は、コンソールで JSON を読み込み `store.add`/`store.put` する簡単なスクリプトを実行してください（重複に注意）。
4. 読み込み後にページをリロードすると一覧に反映されます。

## 3. 注意事項

- ブラウザのストレージは OS のクリーンアップやユーザー操作で削除される場合があります。重要なノートは定期的にエクスポートしてください。
- JSON にはテイスティング内容がそのまま含まれるため、取り扱いには注意しましょう。
- 将来的にクラウド同期機能を追加する場合は、この JSON をアップロードする API を追加するだけで移行可能です。

IndexedDB のスキーマは `apps/web/lib/localNotes.ts` を参照してください。


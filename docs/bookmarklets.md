# ブックマークレットでノートを自動入力する

IndexedDB に保存されている直近のテイスティングノートをフォームに流し込むブックマークレットです。`/notes/new` 画面で実行すると、入力欄に直近ノートの内容が自動でセットされます。

```text
javascript:(async()=>{const openDb=()=>new Promise((resolve,reject)=>{const request=indexedDB.open('whisky-notes',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>resolve(request.result);});try{const db=await openDb();const tx=db.transaction('notes','readonly');const store=tx.objectStore('notes');const notes=await new Promise((resolve,reject)=>{const getAll=store.getAll();getAll.onerror=()=>reject(getAll.error);getAll.onsuccess=()=>resolve(getAll.result||[]);});if(!notes.length){alert('ノートが見つかりません');return;}const latest=[...notes].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];const setValue=(name,value)=>{const el=document.querySelector(`[name="${name}"]`);if(el){el.value=value??'';el.dispatchEvent(new Event('input',{bubbles:true}));}};setValue('whisky_name',latest.whisky_name);setValue('distillery_name',latest.distillery_name);setValue('region',latest.region);setValue('aroma',latest.aroma);setValue('flavor',latest.flavor);setValue('summary',latest.summary);setValue('abv',latest.abv);setValue('cask',latest.cask);setValue('rating',latest.rating);}catch(error){console.error(error);alert('IndexedDB からノートを取得できませんでした');}})();
```

## 使い方

1. ブラウザで新しいブックマークを作成し、URL 欄に上記文字列を貼り付けて保存します。
2. アプリで `/notes/new` ページを開きます。
3. 先ほど作成したブックマークを実行すると、直近のノート内容が入力欄に反映されます。

> **ヒント**: 初回は少なくとも 1 件ノートを登録してから利用してください。IndexedDB が空の場合は「ノートが見つかりません」と表示されます。


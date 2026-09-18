# Формат .phonegame, schemaVersion 1

Файл представляет собой ZIP. Редактор записывает метод STORE (0), читает STORE и DEFLATE (8). DEFLATE распаковывается встроенным DecompressionStream браузера. Архив защищён проверками CRC32, размеров, количества записей и путей. ZIP64, шифрование и многотомные архивы не поддерживаются. Сумма распакованных ресурсов ограничена 100 МБ, количество файлов — 5000.

Структура:

```text
manifest.json
assets/<resource-id>
```

`manifest.json` — UTF-8 JSON:

- `schemaVersion`: `1`. Другие версии отклоняются; предыдущих опубликованных версий формата пока нет.
- `id`, `name`: ID и название проекта.
- `design`: `template` (modern/retro/school), width, scene/body/screen/text/accent (HEX), background (ID или null), fit (cover/contain), font, questionSize/answerSize/nameSize/buttonSize.
- `game`: lives (1–20), unlimited, lifeIcon, lifeDisplay (row/count), retry, callSeconds (0–5).
- `language`: locale (ru/en/es/fr/de/tr/kk/it/pt), layouts (те же коды и num), initial, overrides (словарь служебных подписей).
- `screens`: title, intro, win/complete/lose (пустая строка — перевод по умолчанию), winColor/completeColor/loseColor.
- `sounds`: ring/correct/wrong (boolean), volume (0–1), ringAsset/correctAsset/wrongAsset (ID или null).
- `heroes`: упорядоченный массив героев.
- `assets`: словарь `{resourceId: {name, type, path: "assets/resourceId"}}`. Поддерживаются image/png, image/jpeg, image/webp, audio/mpeg, audio/wav.

Герой: `id`, `name`, `greeting`, `enabled`, `avatar`, `shape` (circle/square), `zoom` (1–3), `x`/`y` (0–100), `tasks`.

Задание: `id`, `type` (single/multi/text/order/audio), `enabled`, `question`, `image`, `audio`, `explanation`, `options` (массив `{id,text}`), `correct` (массив ID), `answers` (массив текстов), `audioMode` (single/multi/text), `shuffle`, `locale`, `layout` (пустая строка — настройка игры), `caseSensitive`, `ignorePunctuation`, `yoEqualsE`.

Для сортировки эталоном является порядок `options`, `correct` не используется. Варианты проверяются по ID. Все ID проекта, героев, заданий и вариантов уникальны в одном проекте. Дублирование создаёт новые ID, включая варианты; ключ ответа переносится по отображению старых ID в новые.

В оперативной модели и IndexedDB у ресурса используется `data` (data URL) вместо `path`. Blob URL не сохраняются. Черновик: база IndexedDB `phonegame-editor`, хранилище `drafts`, запись `latest`.

Структурная проверка `PhoneModel.assertSchema` выполняется при импорте; она допускает незаполненные вопросы и ответы для черновиков. Содержательная проверка `PhoneModel.validate` выполняется перед тестом и экспортом. Проверка декодирования медиа производится до замены текущего проекта.

Исходные файлы ресурсов сохраняются в редактируемом проекте, включая заменённые файлы. Экспорт отбирает только активных героев и задания и используемые ими ресурсы. История отмены и результаты ученика в файл не входят.

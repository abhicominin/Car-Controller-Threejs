#!/usr/bin/env node

// Temporary script until this Typedoc issue is fixed
// https://github.com/TypeStrong/typedoc/issues/1060

import fs from 'fs-extra'
import URL from 'url'
import path from 'path'
import readdirp from 'readdirp'
const __dirname = path.dirname(URL.fileURLToPath(import.meta.url))

const docsFolder = path.resolve(__dirname, '../docs')
const cssFile = path.resolve(__dirname, '../docs-style.css')
const cssFileContents = await fs.readFile(cssFile, 'utf-8')

const files = (await readdirp.promise(docsFolder, { fileFilter: '*.html' })).map((f) => f.fullPath)

files.forEach(async (file) => {
  const contents = await fs.readFile(file, 'utf-8')
  const modifiedContents = contents.replace(
    `</style>
</head>`,
    `
    ${cssFileContents}
    </style>
    </head>
    `
  )
  await fs.writeFile(file, modifiedContents)
})

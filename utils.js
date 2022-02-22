
import fs from 'fs'
import path from 'path'
import * as matter from 'gray-matter'

export function getAllPosts(fields = []) {
  let mdFiles  = []
  let mdPath = path.join(process.cwd(), '_posts/posts')

  let throughDirectory = (directory) => {
    fs.readdirSync(directory).forEach(file => {
        const absPath = path.join(directory, file)
        // console.log(absPath)
        if (fs.statSync(absPath).isDirectory()) 
            return throughDirectory(absPath)
        else if(path.extname(absPath) == '.md')
            return mdFiles.push(absPath)
    });
  }
  throughDirectory(mdPath)

  const mdContent = mdFiles.map(file => {
    let mdCont = matter(fs.readFileSync(file, 'utf8'))
    delete mdCont.orig
    return ({
      ...mdCont,
      ...{filename: file.replace(/^.*[\\\/]/, '')}
    })
  })

  mdContent.sort((a, b) => b.filename.localeCompare(a.filename))

  // console.log(mdContent)

  let tagsLists = {}
  let tags = {}
  let tagFilters = {}
  mdContent.forEach( 
    file => {
      Object.keys(file.data.tags).forEach(tagType => {
        let tagsType = file.data.tags[tagType]
        if (typeof tagsType === 'string' || tagsType instanceof String){
          file.data.tags[tagType] = tagsType.split(',').map(
            tag => tag.trim().toLowerCase()
          )
        }
        else{
          file.data.tags[tagType] = file.data.tags[tagType].map(
            tag => tag.trim().toLowerCase()
          )
        }
        tagsLists[tagType] != undefined ? 
          tagsLists[tagType].push(...file.data.tags[tagType]) :
          tagsLists[tagType] = [...file.data.tags[tagType], 'NONE']
      })
    }
  )
  Object.keys(tagsLists).forEach(tagType => {
    tagsLists[tagType] = [...new Set(tagsLists[tagType])]
    tags[tagType] = tagsLists[tagType].reduce((o, key) => ({ ...o, [key]: false}), {})
    tagFilters[tagType] = []
  })

  // console.log(mdContent)
  // console.log(tagsLists)
  // console.log(tags)
  // console.log(tagFilters)
// 
  const items = {}

  return {
    "allPosts" : mdContent,
    "tagsLists" : tagsLists,
    "tagFilters" : tagFilters,
    "tags" : tags
  }
}
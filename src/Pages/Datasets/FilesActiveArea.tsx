/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */


import { AddRounded, ArrowBackRounded, CheckRounded, CloudUploadRounded, ContentCopyRounded, ContentCutRounded, ContentPasteRounded, CreateNewFolderRounded, DeleteRounded, DeselectRounded, DownloadRounded, DriveFileRenameOutlineRounded, DynamicFeedRounded, FilterListRounded, FolderCopyRounded, OpenWithRounded, PeopleAltRounded, PlusOneRounded, SelectAllRounded } from "@mui/icons-material"
import FilesHeadItem from "./FilesHeadItem"
import FilesRowItem from "./FilesRowItem"
import { useEffect, useRef, useState } from "react"
import WindowTextInput from "./WindowTextInput"
import { Box, Button, Dialog, Divider, IconButton, Modal, Stack, Tooltip, Typography } from "@mui/material"
import { ExplorerItem } from "../../types/global"

const data:{info: ExplorerItem, content: ExplorerItem[]} = {
  info: {
    id: "0",
    addDate: 0,
    name: "folder",
    size: -1,
    upper: "A"
  },
  content: [
    {
      id: "1",
      addDate: 1,
      name: "folder1",
      size: -1,
      upper: "0"
    },
    {
      id: "2",
      addDate: 5,
      name: "folder2",
      size: -1,
      upper: "0"
    },
    {
      id: "3",
      addDate: 11,
      name: "aa.img",
      size: 3901892,
      upper: "0"
    },
    {
      id: "4",
      addDate: 1,
      name: "bb.mp4",
      size: 47827,
      upper: "0"
    },
    {
      id: "5",
      addDate: 112,
      name: "cc.mov",
      size: 10000,
      upper: "0"
    },
    {
      id: "3",
      addDate: 11,
      name: "plant.img",
      size: 372893,
      upper: "0"
    },
    {
      id: "4",
      addDate: 1,
      name: "measurement01.mp4",
      size: 98893,
      upper: "0"
    },
    {
      id: "5",
      addDate: 112,
      name: "2024-01-01.mov",
      size: 4792898427987,
      upper: "0"
    },
    {
      id: "3",
      addDate: 11,
      name: "biodata.img",
      size: 798387,
      upper: "0"
    },
    {
      id: "4",
      addDate: 1,
      name: "cupcake.mp4",
      size: 7183,
      upper: "0"
    },
    {
      id: "5",
      addDate: 112,
      name: "hello.mov",
      size: 4239874,
      upper: "0"
    },
  ]
}

// Returns a human readable time label
export const displayTime = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30.4)
  const years = Math.floor(days / 365)
  if (years > 0) return `${years} y ago`
  if (months > 0) return `${months} mon ago`
  if (days > 0) return `${days} d ago`
  if (hours > 0) return `${hours} h ago`
  if (minutes > 0) return `${minutes} min ago`
  return `${seconds} s ago`
}

// Returns human readable size of a file
export const displaySize = (bytes: number) => {
  if (bytes===-1) return ""
  const KB = Math.floor(bytes / 1000)
  const MB = Math.floor(KB / 1000)
  const GB = Math.floor(MB / 1000 * 10)/10
  if (GB > 1) return `${GB > 100 ? Math.floor(GB) : GB} GB`
  if (MB > 0) return `${MB} MB`
  if (KB > 0) return `${KB} KB`
  return `${bytes} B`
}

export function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  reversed: boolean,
  orderBy: Key,
) : (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return reversed
    ? (a, b) => -descendingComparator(a, b, orderBy)
    : (a, b) => descendingComparator(a, b, orderBy);
}

export function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Lowest level folder browser component
// Contains action buttons (copy, paste, delete...),
//  logic for changing paths,
//  sorting items
const FilesActiveArea = (props: {
  id: string,
  changeId: (id: string) => void,
  //isSelector: boolean | undefined
}) => {

  type Column = "name" | "addDate" | "size"
  const [sortBy, setSortBy] = useState<Column>("name")
  const [sortReverse, setSortReverse] = useState<boolean>(true)
  const [selectedItems, setSelectedItems] = useState<ExplorerItem[]>([])
  
  // Data manipulation modals
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false)
  const [renameItemModalVisible, setRenameItemModalVisible] = useState(false)
  const [shareItemModalVisible, setShareItemModalVisible] = useState(false)
  const [externalModalVisible, setExternalModalVisible] = useState(false)

  const clickHeader = (column: Column) => {
    if (sortBy===column) {
      setSortReverse(!sortReverse)
    }
    else {
      setSortBy(column)
      setSortReverse(false)
    }
  }
  const [sortedItems, setSortedItems] = useState<ExplorerItem[]>([])
  const lastSelect = useRef(-1)
  useEffect(() => {
    setSortedItems(stableSort(data.content, getComparator(sortReverse, sortBy)))
  }, [sortReverse, sortBy, data])

  // Browse folders using arrow keys
  const keyDown = (e: any) => {
    if (e.key==="ArrowUp") {
      if (lastSelect.current > 0) {
        lastSelect.current = lastSelect.current - 1;
        setSelectedItems([sortedItems[lastSelect.current]])
      }
    }
    else if (e.key==="ArrowDown") {
      if (lastSelect.current < sortedItems.length - 1) {
        lastSelect.current = lastSelect.current + 1;
        setSelectedItems([sortedItems[lastSelect.current]])
      }
    }
    else if (e.key==="ArrowLeft") {
      handleBackButton()
    }
    else if (e.key==="ArrowRight") {
      if (selectedItems.length===1) {
        props.changeId(selectedItems[0].id)
        setSelectedItems([])
        lastSelect.current = -1
      }
    }
    else if (e.key==="Enter") {
      e.preventDefault()
      setRenameItemModalVisible(true)
    }
  }

  // Selecting items using mouse + ctrl/cmd or shift
  //  handles double click for opening folders
  const handleClick = (e: any, item: ExplorerItem, index:number) => {
    if (e.ctrlKey || e.metaKey) {
      if (selectedItems.includes(item)) {
        setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item))
      }
      else {
        setSelectedItems([...selectedItems, item])
      }
    }
    else if (e.shiftKey) {
      if (index > lastSelect.current) {
        setSelectedItems(Array.from(new Set([...selectedItems, ...sortedItems.slice(lastSelect.current, index+1)])))
      }
      else {
        setSelectedItems(Array.from(new Set([...selectedItems, ...sortedItems.slice(index, lastSelect.current+1)])))
      }
    }
    else if (e.detail === 2) {
      if (item.size===-1) {
        props.changeId(item.id)
        setSelectedItems([])
        lastSelect.current = -1
      }
    }
    else {
      setSelectedItems([item])
    }
    lastSelect.current = index
  }

  const handleBackButton = () => {
    props.changeId(data.info.upper)
    setSelectedItems([])
    lastSelect.current = -1
  }

  return (
    <>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
        <Stack direction="row" overflow="auto" width={1} alignItems="center" spacing={2}>
          <IconButton disabled={!data.info.upper} onClick={handleBackButton}><ArrowBackRounded/></IconButton>
          <Typography noWrap variant="h6">{data.info.name==="" ? "My files" : data.info.name}</Typography>
        </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            
            <Stack direction="row" alignItems="center" spacing={1} display={"flex"}>
              <Tooltip title="New folder">
                <IconButton onClick={() => setNewFolderModalVisible(true)} size="small">
                  <CreateNewFolderRounded fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Upload">
                <IconButton onClick={() => {}} size="small">
                  <CloudUploadRounded fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>


            {selectedItems.length===1 ?
              <>
                <Stack direction="row" alignItems="center" spacing={1} display={"flex"}>
                  
                    <Tooltip title="Rename">
                      <IconButton onClick={() => setRenameItemModalVisible(true)} size="small">
                        <DriveFileRenameOutlineRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton onClick={() => setShareItemModalVisible(true)} size="small">
                        <PeopleAltRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {selectedItems.filter((item) => item.size===-1).length===0 ? 
                      <Tooltip title="Open with external application">
                        <IconButton onClick={() => setExternalModalVisible(true)} size="small">
                          <DynamicFeedRounded fontSize="small" />
                        </IconButton>
                      </Tooltip> 
                    : null}
                  
                </Stack>
              </>
            : null}

            {selectedItems.length > 0 && selectedItems.filter((item) => item.size===-1).length===0 ?
              <>
                <Tooltip title="Download">
                  <IconButton onClick={() => {}} size="small">
                    <DownloadRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            : null}

            {selectedItems.length > 0 ? // || itemSelection.mode!=="" ?
              <>
                <Stack direction="row" alignItems="center" spacing={1} display={"flex"}>
                  {false ? //itemSelection.mode!=="" ? 
                    <>
                      <Tooltip title="Paste">
                        <IconButton onClick={() => {}} size="small">
                          <ContentPasteRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel selection">
                        <IconButton onClick={() => {}} size="small">
                          <DeselectRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  :
                    <>
                      <Tooltip title="Cut">
                        <IconButton onClick={() => {}} size="small">
                          <ContentCutRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy">
                        <IconButton onClick={() => {}} size="small">
                          <ContentCopyRounded fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  }
                    <Tooltip title="Delete">
                      <IconButton size="small">
                        <DeleteRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                </Stack>
              </>
            : null}
          </Stack>
      </Stack>

      {/*Drag&drop zone expanding div, also registers keyboard events*/}
      <div
        tabIndex={-1}
        onKeyDown={keyDown}
        style={{ outline: "none", flex: 1, flexDirection: "column", display: "flex", minWidth: "0", minHeight: "0" }}
        //onDrop={handleFileDrop}
        onDragOver={e => e.preventDefault()}
        onDragLeave={e => e.preventDefault()} 
      >
        {/*Table headers*/}
        <Stack direction="row" pl={1} pr={1} pb={0.5}>
          <FilesHeadItem onClick={() => clickHeader("name")} sx={{ flex: 1 }} sort={sortBy==="name"?(sortReverse?"up":"down"):"none"} anchor="left" label="Name"/>
          <FilesHeadItem onClick={() => clickHeader("addDate")} sx={{ width: 101 }} sort={sortBy==="addDate"?(sortReverse?"up":"down"):"none"} anchor="right" label="Date added"/>
          <FilesHeadItem onClick={() => clickHeader("size")} sx={{ width: 80 }} sort={sortBy==="size"?(sortReverse?"up":"down"):"none"} anchor="right" label="Size"/>
        </Stack>
        <Stack direction="column" height={1} overflow={"auto"}>

          {sortedItems.map((item, index) =>
            <>
              <div onClick={(e) => handleClick(e, item, index)}>
                <Divider />
                <Box pb={0.35} pt={0.35} sx={{ backgroundColor: selectedItems.includes(item) ? (theme) => theme.palette.grey[300] : null }}>
                    <Stack direction="row" pl={1} pr={1}>
                      <FilesRowItem sx={{ flex: 1 }} anchor="left">{item.name}</FilesRowItem>
                      <FilesRowItem sx={{ width: 101 }} anchor="right">{displayTime(Date.now()-(new Date (item.addDate).getTime()))}</FilesRowItem>
                      <FilesRowItem sx={{ width: 80 }} anchor="right">{displaySize(item.size)}</FilesRowItem>
                    </Stack>
                </Box>
              </div>
            </>
          )}
          <div onClick={() => setSelectedItems([])} style={{ flex: 1 }}/>
        </Stack>
      </div>
      

      <Dialog open={newFolderModalVisible} onClose={() => setNewFolderModalVisible(false)}>
        <WindowTextInput 
          item={{id: props.id}}
          closeSelf={() => setNewFolderModalVisible(false)}
          type="new"
        />
      </Dialog>

      <Dialog open={renameItemModalVisible} onClose={() => setRenameItemModalVisible(false)}>
        <WindowTextInput
          item={selectedItems[0]}
          closeSelf={() => setRenameItemModalVisible(false)}
          type="rename"
        />
      </Dialog>


    </>

  )
}

export default FilesActiveArea;

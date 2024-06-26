/*
 *  Author: Tomáš Drdla (xdrdla04@stud.fit.vutbr.cz)
 */


import { AddRounded, ArrowBackRounded, CheckRounded, CloudUploadRounded, ContentCopyRounded, ContentCutRounded, ContentPasteRounded, CreateNewFolderRounded, DeleteRounded, DeselectRounded, DownloadRounded, DriveFileRenameOutlineRounded, DynamicFeedRounded, FilterListRounded, Folder, FolderCopyRounded, InsertDriveFile, OpenWithRounded, PeopleAltRounded, PlusOneRounded, RestartAlt, Search, SelectAllRounded } from "@mui/icons-material"
import FilesHeadItem from "./FilesHeadItem"
import FilesRowItem from "./FilesRowItem"
import { useEffect, useMemo, useRef, useState } from "react"
import WindowTextInput from "./WindowTextInput"
import { Box, Button, ButtonProps, Dialog, Divider, IconButton, InputAdornment, Modal, Stack, TextField, Tooltip, Typography, styled } from "@mui/material"
import { ExplorerItem } from "../../types/global"
import { File, Files, useGetFilesQuery } from "../../Services/files"
import MyIconButton from "./MyIconButton"


// const data:{info: ExplorerItem, content: ExplorerItem[]} = {
//   info: {
//     id: "0",
//     addDate: 0,
//     name: "folder",
//     size: -1,
//     upper: "A"
//   },
//   content: [
//     {
//       id: "1",
//       addDate: 1,
//       name: "folder1",
//       size: -1,
//       upper: "0"
//     },
//     {
//       id: "2",
//       addDate: 5,
//       name: "folder2",
//       size: -1,
//       upper: "0"
//     },
//     {
//       id: "3",
//       addDate: 11,
//       name: "aa.img",
//       size: 3901892,
//       upper: "0"
//     },
//     {
//       id: "4",
//       addDate: 1,
//       name: "bb.mp4",
//       size: 47827,
//       upper: "0"
//     },
//     {
//       id: "5",
//       addDate: 112,
//       name: "cc.mov",
//       size: 10000,
//       upper: "0"
//     },
//     {
//       id: "3",
//       addDate: 11,
//       name: "plant.img",
//       size: 372893,
//       upper: "0"
//     },
//     {
//       id: "4",
//       addDate: 1,
//       name: "measurement01.mp4",
//       size: 98893,
//       upper: "0"
//     },
//     {
//       id: "5",
//       addDate: 112,
//       name: "2024-01-01.mov",
//       size: 4792898427987,
//       upper: "0"
//     },
//     {
//       id: "3",
//       addDate: 11,
//       name: "biodata.img",
//       size: 798387,
//       upper: "0"
//     },
//     {
//       id: "4",
//       addDate: 1,
//       name: "cupcake.mp4",
//       size: 7183,
//       upper: "0"
//     },
//     {
//       id: "5",
//       addDate: 112,
//       name: "hello.mov",
//       size: 4239874,
//       upper: "0"
//     },
//   ]
// }

// export type Files = {
//   files: [
//     ['name', string],
//     ['file_id', string],
//     ['mode', string],
//     ['size', number],
//     ['atime', string],
//     ['mtime', string],
//     ['ctime', string],
//     ['owner_id', string],
//     ['parent_id', string],
//     ['provider_id', string],
//     ['shares', string[]],
//     ['type', 'DIR | FILE | REG'],
//     ['children', Files[] | null]
//   ]

// }

// Make function that takes a Files object and return data object
const convertFilesToData = (files: Files): { info: ExplorerItem, content: ExplorerItem[] } => {
  console.log("Files", files)
  const { files: fileInfo } = files;
  const [ name, file_id, mode, size, hard_links_count, atime, mtime, ctime, owner_id, parent_id, provider_id, storage_user_id, storage_group_id, shares, index, type, children] = fileInfo;

  const info: ExplorerItem = {
    id: file_id[1],
    addDate: (new Date(ctime[1])).getTime(),
    modDate: (new Date(mtime[1])).getTime(),
    name: name[1],
    size: size[1],
    upper: parent_id[1],
  };

  let content: ExplorerItem[] = [];
  if (children !== null) {
    console.log("Children info", children[1])
  }
  if (children) {
    content = (children[1] as unknown as File[])?.map((child: File) => {
      console.log("Child", child)
      const [ name, file_id, mode, size, hard_links_count, atime, mtime, ctime, owner_id, parent_id, provider_id, storage_user_id, storage_group_id, shares, index, type] = child;
      return {
        id: file_id[1],
        addDate: (new Date(ctime[1] as string)).getTime(),
        modDate: (new Date(mtime[1] as string)).getTime(),
        name: name[1],
        size: size[1],
        upper: parent_id[1],
      } as unknown as ExplorerItem
    }) ?? [];
  }
  return { info, content };
};

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
  autoRefresh: boolean,
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
  const [ searchTerm, setSearchTerm ] = useState<string>("")

  const [ currentFolderId, setCurrentFolderId ] = useState<string | null>(null)
  const { data: filesData, isLoading } = useGetFilesQuery({ dataset_id: props.id, file_id: currentFolderId}, {pollingInterval: props.autoRefresh ? 10000 : 0})


  const data = useMemo(() => {
    if (filesData) {
      return convertFilesToData(filesData);
    }
    return null;
  }, [filesData])

  const clickHeader = (column: Column) => {
    if (sortBy===column) {
      setSortReverse(!sortReverse)
    }
    else {
      setSortBy(column)
      setSortReverse(false)
    }
  }
  const lastSelect = useRef(-1)

  const sortedItems = useMemo(() => {
    if (searchTerm.length === 0){
      return stableSort(data?.content || [], getComparator(sortReverse, sortBy))
    } else {
      const filtered = data?.content.filter((item: any) => item.name.includes(searchTerm))
      return stableSort(filtered || [], getComparator(sortReverse, sortBy))
    }
  }, [sortReverse, sortBy, data, searchTerm])

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
      console.log("Single click", item)
      setCurrentFolderId(item.id)
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
    props.changeId(data?.info.upper || "")
    setCurrentFolderId(null)
    setSelectedItems([])
    lastSelect.current = -1
  }

  const [searchFocus, setSearchFocus] = useState(false);
  const [itemDetail, setItemDetail] = useState(true);

  if (data) {
      return (
      <>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Stack direction="row" overflow="auto" width={1} alignItems="center" spacing={2}>
            <IconButton disabled={!data?.info.upper} onClick={handleBackButton}><ArrowBackRounded/></IconButton>
            <Typography noWrap variant="h5" fontWeight={500}>{data?.info.name==="" ? "My files" : data?.info.name}</Typography>
          </Stack>
          {selectedItems.length > 0 && selectedItems.filter((item) => item.size===-1).length===0 ?
            <Stack sx={{ minHeight: 34, border: "solid", borderWidth: "1px", borderRadius: 1, borderColor: (theme) => theme.palette.action.focus, paddingLeft: 1, paddingRight: 1 }} direction="row" alignItems="center" spacing={1} divider={<Divider sx={{ color: "black", height: 32 }} orientation="vertical"/>}>
              {true?null:<>
              <Stack direction="row" alignItems="center" display={"flex"}>
                <MyIconButton tooltip="New folder" onClick={() => setNewFolderModalVisible(true)}>
                  <CreateNewFolderRounded fontSize="inherit" />
                </MyIconButton>

                  <MyIconButton tooltip="Upload" onClick={() => {}}>
                    <CloudUploadRounded fontSize="inherit" />
                  </MyIconButton>
              </Stack>


              {selectedItems.length===1 ?
                <>
                  <Stack direction="row" alignItems="center" display={"flex"}>
                    
                      <MyIconButton tooltip="Rename" onClick={() => setRenameItemModalVisible(true)}>
                        <DriveFileRenameOutlineRounded fontSize="inherit" />
                      </MyIconButton>
                        <MyIconButton tooltip="Share" onClick={() => setShareItemModalVisible(true)}>
                          <PeopleAltRounded fontSize="inherit" />
                        </MyIconButton>
                      {selectedItems.filter((item) => item.size===-1).length===0 ? 
                          <MyIconButton tooltip="Open with external application" onClick={() => setExternalModalVisible(true)}>
                            <DynamicFeedRounded fontSize="inherit" />
                          </MyIconButton>
                      : null}
                    
                  </Stack>
                </>
              : null}

              {selectedItems.length > 0 ? // || itemSelection.mode!=="" ?
                <>
                  <Stack direction="row" alignItems="center" display={"flex"}>
                    {false ? //itemSelection.mode!=="" ? 
                      <>
                        <MyIconButton tooltip="Paste" onClick={() => {}}>
                          <ContentPasteRounded fontSize="inherit" />
                        </MyIconButton>
                        <MyIconButton tooltip="Cancel selection" onClick={() => {}}>
                          <DeselectRounded fontSize="inherit" />
                        </MyIconButton>
                      </>
                    :
                      <>
                        <MyIconButton tooltip="Cut" onClick={() => {}}>
                          <ContentCutRounded fontSize="inherit" />
                        </MyIconButton>
                        <MyIconButton tooltip="Copy" onClick={() => {}}>
                          <ContentCopyRounded fontSize="inherit" />
                        </MyIconButton>
                      </>
                    }
                      <MyIconButton tooltip="Delete">
                        <DeleteRounded fontSize="inherit" />
                      </MyIconButton>
                      
                  </Stack>
                </>
              : null}

              </>}
              
                <>
                  <MyIconButton tooltip="Download" onClick={() => {}}>
                    <DownloadRounded sx={{ color: (theme) => theme.palette.mode==="dark" ? theme.palette.text.primary : theme.palette.action.active }} fontSize="inherit" />
                  </MyIconButton>
                </>

            </Stack>
            : null}
            <Box sx={{ display: 'flex', alignItems: 'flex-end', ml: 3, fontSize: 22 }}>

            <TextField
              margin="dense"
              size="small"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: searchFocus ? 350 : 50, transition: "0.25s", m: 0 }}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => searchTerm==="" ? setSearchFocus(false) : null}
              InputLabelProps={{sx: {fontSize: 15, mt: -0.4}}}
              InputProps={{ sx: {height: 34},
                startAdornment: (
                  <div style={{width: 36, pointerEvents: "none"}}>
                    <InputAdornment sx={{width: 0, height: 0}} position="start">
                      <Search />
                    </InputAdornment>
                  </div>
                ),
              }}
          />
          </Box>
        </Stack>

      
        <Stack direction="row">
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
            <Stack direction="row" p={1}>
              <Folder sx={{ marginRight: 3, visibility: "hidden" }} fontSize="medium"></Folder>
              <FilesHeadItem onClick={() => clickHeader("name")} sx={{ flex: 1 }} sort={sortBy==="name"?(sortReverse?"up":"down"):"none"} anchor="left" label="Name"/>
              {itemDetail && selectedItems.length !== 0 ? null :
              <>
                <FilesHeadItem onClick={() => clickHeader("addDate")} sx={{ width: 103 }} sort={sortBy==="addDate"?(sortReverse?"up":"down"):"none"} anchor="right" label="Date added"/>
                <FilesHeadItem onClick={() => clickHeader("size")} sx={{ width: 80 }} sort={sortBy==="size"?(sortReverse?"up":"down"):"none"} anchor="right" label="Size"/>
              </>
              }
            </Stack>
            <Stack direction="column" height={1} overflow={"auto"} sx={{ userSelect: "none", WebkitUserSelect: "none" }}>

              {sortedItems.map((item, index) =>
                <>
                  <div onClick={(e) => handleClick(e, item, index)}>
                    <Divider/>
                    <Box pb={1} pt={1} sx={{ backgroundColor: selectedItems.includes(item) ? (theme) => theme.palette.action.selected : null }}>
                        <Stack direction="row" pl={1} pr={1} alignItems={"center"}>
                          {item.name.includes(".") ?
                            <InsertDriveFile sx={{ marginRight: 3, opacity: 0.7 }} fontSize="medium"></InsertDriveFile>
                            :
                            <Folder sx={{ marginRight: 3, opacity: 0.7 }} fontSize="medium"></Folder>
                          }
                          <FilesRowItem sx={{ flex: 1 }} anchor="left">{item.name}</FilesRowItem>
                          {itemDetail && selectedItems.length !== 0 ? null :
                          <>
                            <FilesRowItem sx={{ width: 103 }} anchor="right">{displayTime(Date.now()-(new Date (item.addDate).getTime()))}</FilesRowItem>
                            <FilesRowItem sx={{ width: 80 }} anchor="right">{displaySize(item.size)}</FilesRowItem>
                          </>
                          }
                        </Stack>
                    </Box>
                  </div>
                </>
              )}
              <div onClick={() => setSelectedItems([])} style={{ flex: 1 }}/>
            </Stack>
          </div>
          {itemDetail && selectedItems.length !== 0 ?
            <Stack direction="row" pl={3}>
              <Divider orientation="vertical" />
              <Stack direction="column" width={400} px={3} py={2} spacing={0.5}>
                <Typography variant="h5" fontWeight={500} pb={1}>Detail</Typography>

                <Stack direction={"row"} justifyContent="space-between" spacing={3}>
                  <Typography variant="body1">Name:</Typography>
                  <Typography variant="body1">{selectedItems[0].name}</Typography>
                </Stack>

                <Stack direction={"row"} justifyContent="space-between" spacing={3}>
                  <Typography variant="body1">ID:</Typography>
                  <Typography textOverflow="ellipsis" overflow={"hidden"} variant="body1">{selectedItems[0].id}</Typography>
                </Stack>

                <Stack direction={"row"} justifyContent="space-between" spacing={3}>
                  <Typography variant="body1">Date added:</Typography>
                  <Typography variant="body1">{displayTime(Date.now()-(new Date (selectedItems[0].addDate).getTime()))}</Typography>
                </Stack>

                <Stack direction={"row"} justifyContent="space-between" spacing={3}>
                  <Typography variant="body1">Date modified:</Typography>
                  <Typography variant="body1">{displayTime(Date.now()-(new Date (selectedItems[0].modDate).getTime()))}</Typography>
                </Stack>

                <Stack direction={"row"} justifyContent="space-between" spacing={3}>
                  <Typography variant="body1">Size:</Typography>
                  <Typography variant="body1">{displaySize(selectedItems[0].size)}</Typography>
                </Stack>

                <img src="https://lekarnacz.vshcdn.net/upload/dn/a-/dna-deoxyribonukleova-kyselina-zaklad-zivota-2362830-700x467-fit.jpg" alt="W3Schools.com"/>

              </Stack>
            </Stack>
          : null}
        
        </Stack>
        

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


      </>)
  } else {
    return <div>loading</div>
  }
}

export default FilesActiveArea;

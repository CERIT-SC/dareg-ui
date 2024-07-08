import { useState } from "react"
import ContentCard from "../../Components/ContentCard"
import { Box, Button, Dialog, DialogContent, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Delete } from "@mui/icons-material"

const PreShareTab = () => {
    const [newLinkWindow, setNewLinkWindow] = useState(false)
    const [newLinkLabel, setNewLinkLabel] = useState("")
    const [newLinkLevel, setNewLinkLevel] = useState("read")
    const [shares, setShares] = useState<{id: number, level:"read"|"readwrite"|"full", label:string}[]>([])

    const handleNewShare = () => {
        setNewLinkWindow(false)
        setShares([...shares, {id:Math.floor(Math.random() * 1000), level:newLinkLevel as "read"|"readwrite"|"full", label: newLinkLabel}])
        setNewLinkLabel("")
        setNewLinkLevel("read")
    }

    return (
        <ContentCard title={"Pre-share"} actions={
            <Button size="small" variant="contained" onClick={() => setNewLinkWindow(true)}>Add new</Button>
        }>
            <>
                {shares.length > 0 ? shares.map((share) => (
                <>
                    <Divider/>
                    <Stack direction="row" alignItems={"center"} spacing={2} py={1} justifyContent={"space-between"}>
                        <IconButton size="small" onClick={() => setShares(shares.filter((item) => item.id != share.id))}>
                            <Delete/>
                        </IconButton>
                        <Box flex={2} overflow="auto">
                            <Typography noWrap >https://devel.dareg.biodata.ceitec.cz/api/v1/share/fj2h2eo20wiojerigjeirg</Typography>
                        </Box>
                        <Box flex={1}>
                            <TextField label="Label" fullWidth size="small" value={share.label} onChange={(e) => setShares(shares.map((item) => item.id === share.id ? {...item, label: e.target.value} : item))}></TextField>
                        </Box>
                        <FormControl sx={{width: 200}}>
                            <InputLabel id={`${share.id}-label`}>Permissions</InputLabel>
                            <Select
                                labelId={`${share.id}-label`}
                                value={share.level}
                                label="Permissions"
                                size="small"
                                onChange={(e) => setShares(shares.map((item) => item.id === share.id ? {...item, level: e.target.value as "read"|"readwrite"|"full"} : item))}
                            >
                                <MenuItem value={"read"}>Read-only</MenuItem>
                                <MenuItem value={"readwrite"}>Read-write</MenuItem>
                                <MenuItem value={"full"}>Full access</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </>
                )) : <Typography>No active shares links</Typography>}
                <Dialog open={newLinkWindow} onClose={() => setNewLinkWindow(false)}>
                <DialogContent sx={{ width: 400 }}>
                        <Stack>
                                <Box>
                                    <Typography variant="h6">
                                        Add a new link share
                                    </Typography>
                                    <Typography variant="body2">
                                        You can add a label for later identification
                                    </Typography>
                                </Box>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="name"
                                    label="Label"
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                    sx={{mt:1}}
                                    value={newLinkLabel}
                                    onChange={(e) => setNewLinkLabel(e.target.value)}
                                />
                                <FormControl sx={{mt:2}}>
                                <InputLabel id={"newshare-label"}>Permissions</InputLabel>
                                <Select
                                    labelId={"newshare-label"}
                                    value={newLinkLevel}
                                    label="Permissions"
                                    size="small"
                                    onChange={(e) => setNewLinkLevel(e.target.value)}
                                >
                                    <MenuItem value={"read"}>Read-only</MenuItem>
                                    <MenuItem value={"readwrite"}>Read-write</MenuItem>
                                    <MenuItem value={"full"}>Full access</MenuItem>
                                </Select>
                                </FormControl>

                            <Stack direction="row-reverse" spacing={2} sx={{mt:2}}>
                                <Button type="submit" onClick={handleNewShare} variant="contained">Submit</Button>
                            </Stack>
                        </Stack>
                </DialogContent>
                </Dialog>
            </>
        </ContentCard>
    )
}

export default PreShareTab;
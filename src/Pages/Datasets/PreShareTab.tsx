import { useState } from "react"
import ContentCard from "../../Components/ContentCard"
import { Box, Button, Dialog, DialogContent, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { useTranslation } from "react-i18next"

const PreShareTab = () => {
    const { t } = useTranslation()

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
        <ContentCard title={t('PreShareTab.preShare')} actions={
            <Button size="small" variant="contained" onClick={() => setNewLinkWindow(true)}>{t('PreShareTab.addNew')}</Button>
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
                            <TextField label={t('PreShareTab.label')} fullWidth size="small" value={share.label} onChange={(e) => setShares(shares.map((item) => item.id === share.id ? {...item, label: e.target.value} : item))}></TextField>
                        </Box>
                        <FormControl sx={{width: 200}}>
                            <InputLabel id={`${share.id}-label`}>{t('PreShareTab.permissions')}</InputLabel>
                            <Select
                                labelId={`${share.id}-label`}
                                value={share.level}
                                label={t('PreShareTab.permissions')}
                                size="small"
                                onChange={(e) => setShares(shares.map((item) => item.id === share.id ? {...item, level: e.target.value as "read"|"readwrite"|"full"} : item))}
                            >
                                <MenuItem value={"read"}>{t('PreShareTab.readOnly')}</MenuItem>
                                <MenuItem value={"readwrite"}>{t('PreShareTab.readWrite')}</MenuItem>
                                <MenuItem value={"full"}>{t('PreShareTab.fullAccess')}</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </>
                )) : <Typography>{t('PreShareTab.noActive')}</Typography>}
                <Dialog open={newLinkWindow} onClose={() => setNewLinkWindow(false)}>
                <DialogContent sx={{ width: 400 }}>
                        <Stack>
                                <Box>
                                    <Typography variant="h6">
                                        {t('PreShareTab.addNewLinkShare')}
                                    </Typography>
                                    <Typography variant="body2">
                                        {t('PreShareTab.labelLabel')}
                                    </Typography>
                                </Box>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    name="name"
                                    label={t('PreShareTab.label')}
                                    type="text"
                                    fullWidth
                                    variant="filled"
                                    size="small"
                                    sx={{mt:1}}
                                    value={newLinkLabel}
                                    onChange={(e) => setNewLinkLabel(e.target.value)}
                                />
                                <FormControl sx={{mt:2}}>
                                <InputLabel id={"newshare-label"}>{t('PreShareTab.permissions')}</InputLabel>
                                <Select
                                    labelId={"newshare-label"}
                                    value={newLinkLevel}
                                    label={t('PreShareTab.permissions')}
                                    size="small"
                                    onChange={(e) => setNewLinkLevel(e.target.value)}
                                >
                                <MenuItem value={"read"}>{t('PreShareTab.readOnly')}</MenuItem>
                                <MenuItem value={"readwrite"}>{t('PreShareTab.readWrite')}</MenuItem>
                                <MenuItem value={"full"}>{t('PreShareTab.fullAccess')}</MenuItem>
                                </Select>
                                </FormControl>

                            <Stack direction="row-reverse" spacing={2} sx={{mt:2}}>
                                <Button type="submit" onClick={handleNewShare} variant="contained">{t('PreShareTab.submit')}</Button>
                            </Stack>
                        </Stack>
                </DialogContent>
                </Dialog>
            </>
        </ContentCard>
    )
}

export default PreShareTab;
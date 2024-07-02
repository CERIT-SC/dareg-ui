import { Button, Table, TableCell, TableRow, Grid, Typography, Stack, Divider, Box } from '@mui/material';
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";
import ceitecLogo from "../ceitec_logo.png"
import useAvatar from '../Utils/useAvatar';
import { User } from 'oidc-client-ts';
import ContentHeader from '../Components/ContentHeader';
import ContentCard from '../Components/ContentCard';
import SettingsMenu from '../Components/SettingsMenu';
import { useGetProfileQuery, useUpdateProfileMutation } from '../Services/profile';
import { useEffect } from 'react';

type AdvancedUser = User & {organization: string}
const Profile = () => {
    const auth = useAuth();
    const { avatarComponent} = useAvatar({size: 220});
    const { t, i18n } = useTranslation()
    const profile = useGetProfileQuery(1)
    const data = profile.data?.results[0]
    console.log(data)
    const [ updateProfile ] = useUpdateProfileMutation()
    useEffect(() => {
        i18n.changeLanguage(data?.default_lang)
    }, [profile.isSuccess])

    const langDict:{[key: string]: string} = {
        "en-US": "English",
        "cs-CZ": "čeština",
    }
    return(
        <>
        <ContentHeader title={"Profile"}>
        </ContentHeader>
        <ContentCard title={`${t('auth.welcome')} ${auth.user?.profile.given_name},`}>
            <Stack alignItems={"center"} direction={"row"} spacing={3} divider={<Divider orientation="vertical" flexItem />}>
                {avatarComponent}
                <Table>
                        <TableRow>
                            <TableCell>
                                {t('profile.name')}      
                            </TableCell>    
                            <TableCell>
                                {auth.user?.profile.name}    
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.organization')}      
                            </TableCell>    
                            <TableCell>
                                {(auth.user as AdvancedUser)?.organization || "Masaryk University"}    
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.email')}   
                            </TableCell>    
                            <TableCell>
                                {auth.user?.profile.email || "Not defined"}    
                            </TableCell>    
                        </TableRow>    
                        <TableRow>
                            <TableCell>
                                {t('profile.logged')}   
                            </TableCell>    
                            <TableCell>
                                <img width="160px" style={{verticalAlign: "middle", marginRight: 10}} src={ceitecLogo} />
                                <Button variant="outlined" color="error" onClick={() => auth.signoutRedirect()}>{t('auth.logout')}</Button>
                            </TableCell>
                        </TableRow>    
                    </Table>
            </Stack>
        </ContentCard>
        {profile.isSuccess ?
            <ContentCard title='Settings'>
                <Box sx={{width: 300}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography>{t("Settings.language")}: </Typography>
                        <SettingsMenu
                            bttnText={langDict[i18n.language]}
                            options={langDict}
                            onClick={(lang: "en-US"|"cs-CZ") => {
                                let updatedProfile
                                const requestData = {
                                    ...data,
                                    default_lang: lang
                                }
                                updatedProfile = updateProfile(requestData)
                                updatedProfile?.then((response) => {
                                    i18n.changeLanguage(lang)
                                })
                            }}
                        />
                    </Stack>
                    <Divider sx={{ mt: 1, mb: 1 }}/>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                        <Typography>{t("Settings.appearance")}: </Typography>
                        <SettingsMenu 
                            bttnText={t(`Settings.${profile.data.results[0].default_theme}`)} 
                            options={{system: t("Settings.system"), light: t("Settings.light"), dark: t("Settings.dark")}}
                            onClick={(theme: "light"|"dark"|"system") => {
                                let updatedProfile
                                const requestData = {
                                    ...data,
                                    default_theme: theme
                                }
                                updatedProfile = updateProfile(requestData)
                            }}
                        />
                    </Stack>
                </Box>
            </ContentCard>
            : <Typography>Loading...</Typography>
        }
        </>
    );
}

export default Profile
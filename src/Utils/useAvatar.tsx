import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import {Md5} from 'ts-md5'

function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
}

function stringAvatar(first: string, last:string) {
    return {
      sx: {
        bgcolor: stringToColor(first+" "+last),
      },
      children: `${first[0]}${last[0]}`,
    };
}

const useAvatar = () => {
    const auth = useAuth();
    const [avatarUrl, setavatarUrl] = useState();
    const [avatarComponent, setAvatarComponent] = useState<JSX.Element>();
    const emailHash = Md5.hashStr(auth.user?.profile.email || "Unknown User");

    useEffect(() => {
        if (!auth.isAuthenticated) return;
        fetch(`https://en.gravatar.com/profile/${emailHash}.json`)
        .then((response) => {
            if (response.status !== 200)return null;
            return response.json()
        })
        .then((data) => {
            setavatarUrl(data["entry"][0]["thumbnailUrl"])
        });
      }, [auth.isAuthenticated]);

      useEffect(() => {
        if (!auth.isAuthenticated) return;
        const tmp = avatarUrl ? <Avatar src={avatarUrl} /> : <Avatar {...stringAvatar(auth.user?.profile.given_name || "U", auth.user?.profile.family_name || "N")} />;
        setAvatarComponent(tmp);
      }, [auth.isAuthenticated, avatarUrl]);


    return {
            avatarComponent,
            avatarUrl
    };
}

export default useAvatar;
import { useSession } from "next-auth/react";
import {useEffect,useState} from "react";
import {useRecoilState} from "recoil";
import {currentTrackIdState,isPlayingState} from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { playlistIdState,playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

import{
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon,
    }from "@heroicons/react/outline" ;

import{
        
        PauseIcon,
        PlayIcon,
        ReplyIcon,
        RewindIcon,
        VolumeUpIcon,
        FastForwardIcon,
        SwitchHorizontalIcon,}
        from "@heroicons/react/solid";


function Player(){
    const spotifyApi = useSpotify();
    const {data:session,status} = useSession();
    const [currentTrackId,setCurrentIdTrack] = useRecoilState(currentTrackIdState);

    const [playlist,setPlaylist] = useRecoilState(playlistState);

    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
    const [volume,setVolume] = useState(50);

    const songInfo= useSongInfo();

    const fetchCurrentSong=()=>{
        if(!songInfo){
         spotifyApi.getMyCurrentPlayingTrack().then((data)=>{

            console.log("Now playing:",data.body?.item);

            setCurrentIdTrack(data.body?.item?.id);
       
      
            spotifyApi.getMyCurrentPlaybackState().then((data)=>{
              setIsPlaying(data.body?.is_playing);
   
            });
        });
    }
};

    const handlePlayPause = () =>{

            spotifyApi.getMyCurrentPlaybackState().then((data) =>{

                if(data.body.is_playing){

                    spotifyApi.pause();
                    setIsPlaying(false)
                }else{
                    spotifyApi.play();
                    setIsPlaying(true)

                }
            }
            
            
            );
    };



    useEffect(()=>{
        if(spotifyApi.getAccessToken() && !currentTrackId){

            //fetch the song info
            fetchCurrentSong();
            setVolume(50);
        }

    },[currentTrackIdState,spotifyApi,session])
        //artist name + song does not show up
    return(
            <div className=" h-24 bg-gradient-to-b from-black to-gray-900 text-white grid-cols-3 text-xs md:text-base px-2 md:px-8">

               <div className="flex items-center space-x-4">
               <img className="hidden md:inline h-10 w-10" src={playlist?.images[0]?.url} />


               <div>

                <p className="w-36 lg:w-64 text-white truncate">{songInfo?.name}</p>
                <p className="w-40">{songInfo?.artist?.[0].name}</p>


               </div>
               </div>

                <div className="flex item-center justify-evenly">
            <SwitchHorizontalIcon className="button" />
            <RewindIcon className="button" />

            {isPlaying ?(
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"  />
            ):(
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"  />

            )}
                    <FastForwardIcon className="button" />
                    <ReplyIcon className="button" />
            
            
        
            </div>

            </div>




            

    );
}

export default Player;
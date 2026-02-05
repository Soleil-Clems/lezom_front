import customfetch from "@/lib/customFetch";
import { channelSchema } from "@/schemas/channel.dto";
import { serversSchema } from "@/schemas/server.dto";
import z from "zod";
import { CreateServerDto } from "@/schemas/create-server.dto";

export const serverRequest = async (body: CreateServerDto) => {
    try {
        const response = await customfetch.post("servers", body);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getAllServersRequest = async () => {
    try {
        const response = await customfetch.get("servers")
        return response
    } catch (error) {
        throw error
    }
}

export const getAllChannelsOfAServerRequest = async (serverId: number | string) => {
    try {
        const url = `channels/server/${serverId}`;
        console.log("Appel API vers :", url); 
        const response = await customfetch.get(url);
        return response;
    } catch (error) {
        throw error;
    }
}



export const updateServerNameRequest = async (serverId: string | number, name: string) => {
    try {
        const response = await customfetch.patch(`servers/${serverId}`, { name });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteServerRequest = async (serverId: string | number) => {
    try {
        const response = await customfetch.delete(`servers/${serverId}`);
        return response;
    } catch (error) {
        throw error;
    }
}


export const updateChannelNameRequest = async (channelId: string | number, name: string) => {
    try {
        const response = await customfetch.patch(`channels/${channelId}`, { name });
        return response;
    } catch (error) {
        throw error;
    }
}

export const deleteChannelRequest = async (channelId: string | number) => {
    try {
        const response = await customfetch.delete(`channels/${channelId}`);
        return response;
    } catch (error) {
        throw error;
    }
}
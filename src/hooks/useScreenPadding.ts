import { useMediaQuery } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
    minPadding: number
    maxPadding: number
}

export default function useScreenPadding(Props: Props) {
    const { minPadding, maxPadding } = Props
    const [screenPadding, setScreenPadding] = useState<number>(minPadding);
    const [isMobile] = useMediaQuery("(max-width: 600px)");

    useEffect(() => {
        if (isMobile === false) {
            setScreenPadding(maxPadding);
        } else {
            setScreenPadding(minPadding);
        }
    }, [isMobile]);


    return { screenPadding }
}
"use client"
import React, {useState} from 'react'

export default function Page() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [day, setDay] = useState("")
    const [month, setMonth] = useState("")
    const [year, setYear] = useState("")

    const [accepted, setAccepted] = useState(false)
    return (
        <div>
            register
        </div>
    )
}



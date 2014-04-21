package main

import (
	"fmt"
	"time"

	"github.com/mrmorphic/hwio"
)

const (
	HT16K33_BLINK_CMD       = 0x80
	HT16K33_BLINK_DISPLAYON = 0x01
	HT16K33_BLINK_OFF       = 0
)

func main() {
	m, e := hwio.GetModule("i2c")
	if e != nil {
		fmt.Printf("could not get i2c module: %s\n", e)
		return
	}
	i2c := m.(hwio.I2CModule)

	fmt.Printf("Setting up i2c\n")
	device := i2c.GetDevice(0x70)
	fmt.Printf("Turning On Device\n")
	device.WriteByte(0x21, 0)
	fmt.Printf("Turning Display On\n")
	device.WriteByte(HT16K33_BLINK_CMD|HT16K33_BLINK_DISPLAYON|(HT16K33_BLINK_OFF<<1), 0)
	fmt.Printf("Setting Brightness\n")
	device.WriteByte((0xE0 | 15), 0)
	fmt.Printf("Clear Display\n")
	for i := 0; i < 16; i++ {
		device.WriteByte((byte)(i), 0x00)
	}
	time.Sleep(1 * time.Second)
	fmt.Printf("Write Green\n")
	for i := 0; i < 16; i += 2 {
		device.WriteByte((byte)(i), 129)
	}
	time.Sleep(1 * time.Second)
	fmt.Printf("Write Red\n")
	for i := 0; i < 16; i += 2 {
		device.WriteByte((byte)(i), 0)
	}
	for i := 1; i < 16; i += 2 {
		device.WriteByte((byte)(i), 129)
	}
	time.Sleep(1 * time.Second)
	fmt.Printf("Write Yellow\n")
	for i := 0; i < 16; i += 2 {
		device.WriteByte((byte)(i), 129)
	}
	for i := 1; i < 16; i += 2 {
		device.WriteByte((byte)(i), 129)
	}
	time.Sleep(5 * time.Second)
	fmt.Printf("Clear Display\n")
	for i := 0; i < 16; i++ {
		device.WriteByte((byte)(i), 0x00)
	}
	fmt.Printf("Turning Off\n")
	device.WriteByte(0x20, 0)
}

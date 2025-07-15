package url

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

func StartURLWorker(service URLService) {
	go func() {
		for {
			_, err := service.AnalyzeNextQueued()
			time.Sleep(2 * time.Second)
			if err != nil && err != gorm.ErrRecordNotFound {
				fmt.Println("Error analyzing next queued URL:", err)
			}
		}
	}()
}

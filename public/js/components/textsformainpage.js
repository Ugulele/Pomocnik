export const textForMainPageContainer = (textType) => {
	switch (textType) {
		case "superelevation": {
			return "Przechyłka - w tej sekcji obliczysz niezbędne wartości przechyłki do jej wyznaczenie. Do jej wyznaczania wykorzystywana jest tu metoda zmiany niedomiaru przechyłki, opisana w załączniku ST-T1-A6 stantardów technicznych PKP PLK. Dodatkowo uzyskane wartości możesz przeliczyć na stopni, co umożliwi ich zastosowanie w edytorze symulatora TrainDriver 2"
		}
		case "transition_curves": {
			return "Krzywe przejściowe - w tej sekcji możesz obliczyć parametry krzywych prześciowych trzech typów, niezbędne do jej prawidłowej konstrukcji. Dostępne do obliczenia są krzywe między prostą a łukiem, jak i również między dwoma łukami, o zwrotach zgodnych jak i przeciwnych. Wyznaczysz tu też minimalną długość krzywej przejściowej w obu dostępnych układach. Dodatkowo dla krzywych przejściowych prosta-łuk istnieje możliwość ich podziału, co jest przydatne przy całkowitej długości krzywej przekraczającej 200m"
		}
		case "track_widenings": {
			return "Poszerzenia międzytorza - w tej sekcji wyznaczysz wszystkie potrzebne parametry do konstrukcji poszerzeń czterech typów. Dodatkowo w każdym z nich możesz zastosować krzywe przejściowe, które będą uwzględnione w obliczeniach, co stanowi duże ułatwienie w ich konstrukcji"
		}
		case "arcs": {
			return "Łuki - tutaj wyznaczysz parametry łuków poziomych i pionowych. Dodatkowo możliwe jest obliczenie minimalnych promieni łuków w różnych sytuacjach. W sekcji dotyczącej łuku pionowego znajdziesz też podstawowe obliczenia z zakresu profilu pionowego"
		}
	}
}

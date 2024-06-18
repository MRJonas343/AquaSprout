int bomba = 8;
int humedad = 0;

void setup() {
   Serial.begin(9600);
   pinMode(bomba, OUTPUT);
}

void loop() {
  humedad = analogRead(A0);

  if (humedad >= 600 && humedad <= 1023) {
    digitalWrite(bomba, LOW);
  } else {
    digitalWrite(bomba, HIGH);
  }

  Serial.println(humedad);
  delay(2000);
}

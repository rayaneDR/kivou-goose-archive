"""Create Kivou's original 24-second sound bed. No samples or external assets."""
import math
import pathlib
import struct
import wave

RATE = 48000
DURATION = 24
DESTINATION = pathlib.Path(__file__).resolve().parents[1] / 'public' / 'kivou-original.wav'

def tone(t, start, duration, frequency, volume):
    age = t - start
    if age < 0 or age >= duration:
        return 0.0
    envelope = min(age / 0.014, 1) * math.exp(-age * 5 / duration)
    return math.sin(age * math.tau * frequency) * envelope * volume

def sample(t):
    value = 0.0
    for start, frequency in ((0.15, 220), (1.1, 330), (2.15, 440), (3.5, 523.25), (8, 587.33), (13, 659.25), (18, 440), (18.18, 554.37), (18.36, 659.25)):
        value += tone(t, start, 1.35, frequency, 0.10)
        value += tone(t, start, 0.6, frequency * 2, 0.018)
    beat = int(t / 0.5)
    age = t - beat * 0.5
    if 3.5 <= t < 18:
        frequency = 65.41 if beat % 8 < 4 else 73.42
        value += math.sin(age * math.tau * frequency) * math.exp(-age * 18) * 0.055
    fade = min(t / 0.1, 1, max((23.3 - t) / 1.3, 0))
    return max(-0.95, min(0.95, value * fade))

DESTINATION.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(DESTINATION), 'wb') as audio:
    audio.setnchannels(2)
    audio.setsampwidth(2)
    audio.setframerate(RATE)
    for index in range(RATE * DURATION):
        value = int(sample(index / RATE) * 32767)
        audio.writeframesraw(struct.pack('<hh', value, value))
print(DESTINATION)

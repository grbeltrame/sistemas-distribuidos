import rpyc
import sys

if len(sys.argv) < 2:
    exit("Usage {} SERVER".format(sys.argv[0]))

server = sys.argv[1]

n = int(input("Digite o tamanho do vetor: "))

vetor = list(range(n))

print(f"Vetor criado com {n} elementos: do 0 até {n-1}")

c = rpyc.connect(server, 18861)

resultado = c.root.soma_vetor(vetor)

print(f"Resultado da soma: {resultado}")
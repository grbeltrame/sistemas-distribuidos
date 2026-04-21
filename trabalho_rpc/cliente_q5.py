import rpyc
import sys
import time

if len(sys.argv) < 2:
    exit("Usage: python3 cliente_q5.py SERVIDOR")

server = sys.argv[1]

n = int(input("Digite o tamanho do vetor: "))
vetor = list(range(n))

c = rpyc.connect(server, 18861, config={"sync_request_timeout": 120})

start = time.time()
resultado = c.root.soma_vetor(vetor)
end = time.time()

print(f"Resultado da soma: {resultado}")
print(f"Tempo no cliente (total com rede): {end - start:.6f} segundos")
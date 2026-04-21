import rpyc
import time

class MyService(rpyc.Service):
    def on_connect(self, conn):
        pass

    def on_disconnect(self, conn):
        pass

    def exposed_get_answer(self):
        return 42

    exposed_the_real_answer_though = 43

    def get_question(self):
        return "Qual é a cor do cavalo branco de Napoleão?"

    def exposed_soma_vetor(self, vetor):
        start = time.time()
        vetor = list(vetor)
        resultado = sum(vetor)
        end = time.time()
        print(f"Tempo no servidor (só a soma): {end - start:.6f} segundos")
        return resultado

if __name__ == "__main__":
    from rpyc.utils.server import ThreadedServer
    t = ThreadedServer(MyService, port=18861)
    print("Servidor rodando na porta 18861...")
    t.start()
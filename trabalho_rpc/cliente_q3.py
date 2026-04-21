import rpyc
import sys

if len(sys.argv) < 2:
    exit("Usage {} SERVER".format(sys.argv[0]))

server = sys.argv[1]

c = rpyc.connect(server, 18861)

print(c.get_question)


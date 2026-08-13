from django.conf import settings

from langgraph.checkpoint.postgres import PostgresSaver
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool


_connection_kwargs = {
    "autocommit": True,
    "prepare_threshold": 0,
    "row_factory": dict_row,
}


aura_checkpoint_pool = ConnectionPool(
    conninfo=settings.LANGGRAPH_DATABASE_URL,
    min_size=1,
    max_size=5,
    kwargs=_connection_kwargs,
)


aura_checkpointer = PostgresSaver(
    aura_checkpoint_pool
)
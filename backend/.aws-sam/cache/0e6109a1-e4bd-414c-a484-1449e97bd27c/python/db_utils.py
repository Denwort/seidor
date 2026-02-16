"""Database utilities for Lambda functions"""
import os
import pymysql
from contextlib import contextmanager


def get_db_config():
    """Get database configuration from environment variables"""
    return {
        "host": os.environ.get("DB_HOST", "localhost"),
        "user": os.environ.get("DB_USER", "root"),
        "password": os.environ.get("DB_PASSWORD", ""),
        "database": os.environ.get("DB_NAME", "swapi_favorites"),
        "port": int(os.environ.get("DB_PORT", 3306)),
        "cursorclass": pymysql.cursors.DictCursor,
        "autocommit": False,
    }


@contextmanager
def get_db_connection():
    """
    Context manager for MariaDB/MySQL connections using PyMySQL
    """
    conn = None
    try:
        conn = pymysql.connect(**get_db_config())
        yield conn
        conn.commit()
    except Exception:
        if conn:
            conn.rollback()
        raise
    finally:
        if conn:
            conn.close()


def execute_query(query, params=None):
    """
    Execute SELECT queries and return results as list of dicts
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.fetchall()


def execute_insert(query, params=None):
    """
    Execute INSERT queries and return last inserted id
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.lastrowid


def execute_delete(query, params=None):
    """
    Execute DELETE queries and return affected rows
    """
    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(query, params or ())
            return cursor.rowcount

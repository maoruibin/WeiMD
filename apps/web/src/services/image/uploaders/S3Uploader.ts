import { S3Client, PutObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import type { ImageUploader } from '../ImageUploader';

export interface S3Config {
    endpoint?: string;
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    path?: string;
    publicUrl?: string;
    forcePathStyle?: boolean;
}

/**
 * S3 兼容图床
 * 支持 AWS S3, Cloudflare R2, MinIO, DigitalOcean Spaces 等
 */
export class S3Uploader implements ImageUploader {
    name = 'S3 兼容图床';
    private config: S3Config;

    constructor(config: S3Config) {
        this.config = config;
    }

    configure(config: S3Config) {
        this.config = config;
    }

    private ensureProtocol(url?: string): string | undefined {
        if (!url) return undefined;
        if (!/^https?:\/\//i.test(url)) {
            return `https://${url}`;
        }
        return url;
    }

    private getClient(): S3Client {
        return new S3Client({
            region: this.config.region,
            endpoint: this.ensureProtocol(this.config.endpoint),
            credentials: {
                accessKeyId: this.config.accessKeyId,
                secretAccessKey: this.config.secretAccessKey,
            },
            forcePathStyle: this.config.forcePathStyle,
        });
    }

    async validate(): Promise<boolean> {
        try {
            if (!this.config.accessKeyId || !this.config.secretAccessKey || !this.config.bucket || !this.config.region) {
                throw new Error('请填写完整的配置信息（AccessKey, SecretKey, Bucket, Region）');
            }

            const client = this.getClient();
            
            // 尝试列出 bucket 来验证权限
            // 如果权限不足，可能只能验证上传，这里先尝试上传一个小文件
            const testKey = `_test_${Date.now()}.txt`;
            const command = new PutObjectCommand({
                Bucket: this.config.bucket,
                Key: testKey,
                Body: 'test',
                ContentType: 'text/plain',
            });
            
            await client.send(command);
            return true;
        } catch (e: any) {
            console.error('S3 validate failed:', e);
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                throw new Error(`跨域错误 (CORS)。请在 S3 控制台配置 Allowed Origins 为 ${window.location.origin}`);
            }
            // 抛出具体错误信息，让 UI 显示
            throw new Error(`验证失败: ${e.message || e}`);
        }
    }

    async upload(file: File): Promise<string> {
        console.log('[S3Uploader] Starting upload...', {
            name: file.name,
            type: file.type,
            size: file.size,
            config: {
                ...this.config,
                accessKeyId: '***',
                secretAccessKey: '***'
            }
        });

        const dateFilename = `${Date.now()}_${file.name}`;
        const path = this.config.path || '';
        // 移除 path 开头和结尾的斜杠
        const cleanPath = path.replace(/^\/+|\/+$/g, '');
        const key = cleanPath ? `${cleanPath}/${dateFilename}` : dateFilename;

        const client = this.getClient();

        try {
            // 将 File 转换为 Uint8Array 以避免 stream 相关的问题
            // 错误 "readableStream.getReader is not a function" 通常是因为环境中的 File/Blob 流实现不完整
            const arrayBuffer = await file.arrayBuffer();
            const body = new Uint8Array(arrayBuffer);

            const command = new PutObjectCommand({
                Bucket: this.config.bucket,
                Key: key,
                Body: body,
                ContentType: file.type,
                // 如果是公共读 bucket，可以设置 ACL，但很多 S3 兼容存储不支持 ACL 或默认私有
                // ACL: 'public-read', 
            });

            console.log('[S3Uploader] Sending PutObjectCommand...');
            await client.send(command);
            console.log('[S3Uploader] Upload successful');

            // 构造返回 URL
            if (this.config.publicUrl) {
                // 移除 publicUrl 结尾的斜杠，并确保有协议前缀
                const publicUrl = this.ensureProtocol(this.config.publicUrl)!;
                const cleanPublicUrl = publicUrl.replace(/\/+$/, '');
                return `${cleanPublicUrl}/${key}`;
            }

            // 默认 S3 URL 格式
            if (this.config.endpoint) {
                // 如果是自定义 endpoint (如 R2, MinIO)
                const endpoint = this.ensureProtocol(this.config.endpoint)!.replace(/\/+$/, '');
                if (this.config.forcePathStyle) {
                    return `${endpoint}/${this.config.bucket}/${key}`;
                }
                // 尝试虚拟主机风格，但这取决于 DNS 配置，保险起见可能需要用户配置 publicUrl
                // 这里做一个简单的推断
                try {
                    const url = new URL(endpoint);
                    return `${url.protocol}//${this.config.bucket}.${url.host}/${key}`;
                } catch {
                    return `${endpoint}/${key}`;
                }
            }

            // AWS S3 默认格式
            return `https://${this.config.bucket}.s3.${this.config.region}.amazonaws.com/${key}`;

        } catch (e: any) {
            console.error('[S3Uploader] Upload failed:', e);
            if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                throw new Error(`上传失败: 跨域错误 (CORS)。请在 S3 控制台配置 CORS 允许 ${window.location.origin} 访问。`);
            }
            throw new Error(`上传失败: ${e.message || e}`);
        }
    }
}
